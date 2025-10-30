import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../infra/database/database.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from '@/common/enums/role.enums';

import { UserModel } from '../models/user.model';
import { UserEntity } from '../entities/user.entity';
import { UserTransformer } from '../transformers/user.transformer';
import { CreateUserDto } from '../dto/create-user.dto';
import { TokenService } from '@/common/auth/token.service';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthJwtPayload } from '@/common/auth/auth.types';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  private toEntityFromPrisma(p: User): UserEntity {
    return UserTransformer.fromPrisma(p);
  }

  private toModelFromPrisma(p: User): UserModel {
    return UserTransformer.toModel(this.toEntityFromPrisma(p));
  }

  private sanitizeModel(m: UserModel): UserModel {
    return new UserModel(
      m.id,
      m.email,
      m.role,
      '',
      m.phoneNumber,
      m.createdAt,
      m.updatedAt,
    );
  }
  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phoneNumber: dto.phoneNumber }] },
      select: { id: true },
    });
    if (exists) throw new ConflictException('Email or phone already used');

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        phoneNumber: dto.phoneNumber,
        role: dto.role ?? Role.STUDENT,
      },
    });

    const model = this.toModelFromPrisma(created);

    const { accessToken, refreshToken, expiresIn, refreshExpiresIn } =
      await this.tokenService.generateTokens({
        sub: model.id,
        role: model.role,
        email: model.email,
      } satisfies AuthJwtPayload);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: model.id },
      data: { refreshTokenHash },
      select: { id: true },
    });

    return {
      user: this.sanitizeModel(model),
      accessToken,
      refreshToken,
      expiresIn,
      refreshExpiresIn,
    };
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.emailOrPhone }, { phoneNumber: dto.emailOrPhone }],
      },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const model = this.toModelFromPrisma(user);
    const { accessToken, refreshToken, expiresIn, refreshExpiresIn } =
      await this.tokenService.generateTokens({
        sub: model.id,
        role: model.role,
        email: model.email,
      } satisfies AuthJwtPayload);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: model.id },
      data: { refreshTokenHash },
      select: { id: true },
    });

    return {
      user: this.sanitizeModel(model),
      accessToken,
      refreshToken,
      expiresIn,
      refreshExpiresIn,
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    const payload = await this.tokenService
      .verifyRefresh(dto.refreshToken)
      .catch(() => {
        throw new UnauthorizedException('Invalid refresh token');
      });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        phoneNumber: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        refreshTokenHash: true,
      },
    });
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const match = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    const model = this.toModelFromPrisma(user);
    const { accessToken, refreshToken, expiresIn, refreshExpiresIn } =
      await this.tokenService.generateTokens({
        sub: model.id,
        role: model.role,
        email: model.email,
      } satisfies AuthJwtPayload);

    const newHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: model.id },
      data: { refreshTokenHash: newHash },
      select: { id: true },
    });

    return {
      user: this.sanitizeModel(model),
      accessToken,
      refreshToken,
      expiresIn,
      refreshExpiresIn,
    };
  }

  async create(model: CreateUserDto): Promise<UserModel> {
    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: model.email }, { phoneNumber: model.phoneNumber }],
      },
      select: { id: true },
    });
    if (exists) throw new ConflictException('Email or phone already used');

    const hashed = await bcrypt.hash(model.password, 10);

    const prismaData = UserTransformer.toPrismaCreate({
      email: model.email,
      password: hashed,
      phoneNumber: model.phoneNumber,
      role: model.role ?? Role.STUDENT,
    });

    const created = await this.prisma.user.create({ data: prismaData });

    return this.sanitizeModel(this.toModelFromPrisma(created));
  }

  async findAll(): Promise<UserModel[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => this.sanitizeModel(this.toModelFromPrisma(u)));
  }

  async findOne(id: string): Promise<UserModel> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitizeModel(this.toModelFromPrisma(user));
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserModel> {
    await this.ensureExists(id);

    const data: Partial<UpdateUserDto> = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.sanitizeModel(this.toModelFromPrisma(updated));
  }

  async remove(id: string): Promise<{ success: true }> {
    await this.ensureExists(id);
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('User not found');
  }
}

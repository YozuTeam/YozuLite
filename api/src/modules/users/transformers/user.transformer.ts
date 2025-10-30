import { Prisma, User as PrismaUser } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';
import { UserModel } from '../models/user.model';
import { Role } from '@/common/enums/role.enums';

export const UserTransformer = {
  fromPrisma(p: PrismaUser): UserEntity {
    return {
      id: p.id,
      email: p.email,
      password: p.password,
      phoneNumber: p.phoneNumber,
      role: p.role as unknown as Role,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  },

  toModel(e: UserEntity): UserModel {
    return new UserModel(
      e.id,
      e.email,
      e.role,
      e.password,
      e.phoneNumber,
      e.createdAt,
      e.updatedAt,
    );
  },

  toPrismaCreate(input: {
    email: string;
    password: string;
    phoneNumber: string;
    role?: Role;
  }): Prisma.UserCreateInput {
    return {
      email: input.email,
      password: input.password,
      phoneNumber: input.phoneNumber,
      role: input.role ?? Role.STUDENT,
    };
  },
};

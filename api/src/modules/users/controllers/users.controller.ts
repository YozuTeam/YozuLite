// apps/.../users/users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles, AuthUser } from '@/common/auth/auth.decorators';
import { Role } from '@/common/enums/role.enums';
import { AuthJwtPayload } from '@/common/auth/auth.types';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.users.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.users.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.users.refreshTokens(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@AuthUser() user: AuthJwtPayload) {
    return this.users.findOne(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@AuthUser() user: AuthJwtPayload, @Body() dto: UpdateUserDto) {
    return this.users.update(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  removeMe(@AuthUser() user: AuthJwtPayload) {
    return this.users.remove(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.users.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOneAdmin(@AuthUser() _user: AuthJwtPayload) {
    return this.users.findOne(_user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  updateAdmin(@Param('id') id: string, @Body() _dto: UpdateUserDto) {
    return this.users.update(id, _dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  removeAdmin(@Param('id') id: string) {
    return this.users.remove(id);
  }
}

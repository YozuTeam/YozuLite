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
import {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  Role,
  UpdateUserRequest,
} from '@yozu/shared';
import { UsersService } from '../services/users.service';

import { AuthUser, Roles } from '@/common/auth/auth.decorators';
import { AuthJwtPayload } from '@/common/auth/auth.types';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterRequest): Promise<AuthResponse> {
    return this.users.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequest): Promise<AuthResponse> {
    return this.users.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenRequest): Promise<AuthResponse> {
    return this.users.refreshTokens(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@AuthUser() user: AuthJwtPayload) {
    return this.users.findOne(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@AuthUser() user: AuthJwtPayload, @Body() dto: UpdateUserRequest) {
    return this.users.update(user.sub, dto);
  }

  // ...

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  updateAdmin(@Param('id') id: string, @Body() _dto: UpdateUserRequest) {
    return this.users.update(id, _dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  removeAdmin(@Param('id') id: string) {
    return this.users.remove(id);
  }
}

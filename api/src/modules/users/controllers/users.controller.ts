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
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthResponse,
  DeleteResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  Role,
  UpdateUserRequest,
  UserResponse,
} from '@yozu/shared';
import { UsersService } from '../services/users.service';

import { AuthUser, Roles } from '@/common/auth/auth.decorators';
import { AuthJwtPayload } from '@/common/auth/auth.types';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description:
      "Creates a new user account and returns authentication tokens. The user can specify their role (STUDENT, COMPANY) or default to STUDENT.\n\n**Accès:** Public (pas d'authentification requise)",
  })
  @ApiBody({ type: RegisterRequest })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: AuthResponse,
  })
  @ApiConflictResponse({
    description: 'Email or phone number already exists',
  })
  @Post('register')
  register(@Body() dto: RegisterRequest): Promise<AuthResponse> {
    return this.users.register(dto);
  }

  @ApiOperation({
    summary: 'Login user',
    description:
      "Authenticates a user with email/phone and password. Returns access and refresh tokens.\n\n**Accès:** Public (pas d'authentification requise)",
  })
  @ApiBody({ type: LoginRequest })
  @ApiOkResponse({
    description: 'Login successful',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequest): Promise<AuthResponse> {
    return this.users.login(dto);
  }

  @ApiOperation({
    summary: 'Refresh authentication tokens',
    description:
      "Uses a valid refresh token to obtain new access and refresh tokens. The old refresh token is invalidated.\n\n**Accès:** Public (pas d'authentification requise)",
  })
  @ApiBody({ type: RefreshTokenRequest })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenRequest): Promise<AuthResponse> {
    return this.users.refreshTokens(dto);
  }

  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Returns the profile information of the currently authenticated user.\n\n**Accès:** Authentifié (tous les rôles)',
  })
  @ApiOkResponse({
    description: 'User profile retrieved successfully',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@AuthUser() user: AuthJwtPayload): Promise<UserResponse> {
    return this.users.findOne(user.sub);
  }

  @ApiTags('Users')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: 'Update current user profile',
    description:
      'Updates the profile of the currently authenticated user. All fields are optional.\n\n**Accès:** Authentifié (tous les rôles)',
  })
  @ApiBody({ type: UpdateUserRequest })
  @ApiOkResponse({
    description: 'User profile updated successfully',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: UpdateUserRequest,
  ): Promise<UserResponse> {
    return this.users.update(user.sub, dto);
  }

  // ========================
  // ADMIN ENDPOINTS
  // ========================

  @ApiTags('Users')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: 'Update user by ID (Admin only)',
    description:
      'Allows administrators to update any user profile by their ID.\n\n**Rôle requis:** `ADMIN`',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID)',
    example: 'c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20',
  })
  @ApiBody({ type: UpdateUserRequest })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have admin privileges',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  updateAdmin(
    @Param('id') id: string,
    @Body() dto: UpdateUserRequest,
  ): Promise<UserResponse> {
    return this.users.update(id, dto);
  }

  @ApiTags('Users')
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: 'Delete user by ID (Admin only)',
    description:
      'Allows administrators to delete any user account by their ID.\n\n**Rôle requis:** `ADMIN`',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID)',
    example: 'c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20',
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: DeleteResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have admin privileges',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  removeAdmin(@Param('id') id: string): Promise<DeleteResponse> {
    return this.users.remove(id);
  }
}

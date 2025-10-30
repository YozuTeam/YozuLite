import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { AuthenticatedRequest, AuthJwtPayload } from './auth.types';
import { Role } from '../enums/role.enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const AuthUser = createParamDecorator<
  ExecutionContext,
  AuthJwtPayload | undefined
>((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return req.user;
});

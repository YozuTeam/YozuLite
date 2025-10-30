// apps/.../auth/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../auth/auth.decorators';
import { AuthenticatedRequest } from '../auth/auth.types';
import { Role } from '../enums/role.enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const role = req.user?.role;

    if (!role) {
      throw new ForbiddenException('Missing role in token');
    }

    const ok = required.includes(role as Role);
    if (!ok) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}

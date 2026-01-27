import { Request } from 'express';
import { Role } from '@/common/enums/role.enums';

export interface AuthJwtPayload {
  sub: string;
  role: Role;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthJwtPayload;
}

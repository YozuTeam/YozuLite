import { Role } from '@yozu/shared';
import { Request } from 'express';

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

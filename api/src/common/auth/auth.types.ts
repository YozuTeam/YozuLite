import { Role } from '@yozu/shared';
import { Request } from 'express';

export interface AuthJwtPayload {
  sub: string;
  role: Role | string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthJwtPayload;
}

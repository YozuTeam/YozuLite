import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../auth/token.service';
import { AuthenticatedRequest, AuthJwtPayload } from '../auth/auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokens: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearer(req.headers?.authorization);

    if (!token) {
      throw new UnauthorizedException('Missing Authorization Bearer token');
    }

    let payload: AuthJwtPayload;
    try {
      payload = await this.tokens.verifyAccess(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    req.user = payload;
    return true;
  }

  private extractBearer(auth?: string): string | null {
    if (!auth) return null;
    const [type, value] = auth.split(' ');
    if (type !== 'Bearer' || !value) return null;
    return value;
  }
}

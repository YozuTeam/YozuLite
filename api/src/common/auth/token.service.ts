import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthJwtPayload } from './auth.types';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async generateTokens(payload: AuthJwtPayload) {
    const accessExp = this.parseSeconds(
      process.env.JWT_ACCESS_EXPIRES || '900',
    );
    const refreshExp = this.parseSeconds(
      process.env.JWT_REFRESH_EXPIRES || '604800',
    );

    const accessOpts: JwtSignOptions = {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: accessExp,
    };
    const refreshOpts: JwtSignOptions = {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: refreshExp,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, accessOpts),
      this.jwt.signAsync(payload, refreshOpts),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessExp,
      refreshExpiresIn: refreshExp,
    };
  }

  async verifyAccess(token: string): Promise<AuthJwtPayload> {
    return this.jwt.verifyAsync<AuthJwtPayload>(token, {
      secret: process.env.JWT_ACCESS_SECRET!,
    });
  }

  async verifyRefresh(token: string): Promise<AuthJwtPayload> {
    return this.jwt.verifyAsync<AuthJwtPayload>(token, {
      secret: process.env.JWT_REFRESH_SECRET!,
    });
  }

  private parseSeconds(expr: string): number {
    const m = /^(\d+)([smhd])$/.exec(expr);
    if (!m) return Number(expr) || 0;
    const v = Number(m[1]);
    switch (m[2]) {
      case 's':
        return v;
      case 'm':
        return v * 60;
      case 'h':
        return v * 3600;
      case 'd':
        return v * 86400;
      default:
        return v;
    }
  }
}

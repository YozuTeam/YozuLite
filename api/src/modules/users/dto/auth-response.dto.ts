import { UserModel } from '../models/user.model';

export class AuthResponseDto {
  user!: Omit<UserModel, 'password'>;
  accessToken!: string;
  refreshToken!: string;
  expiresIn!: number;
  refreshExpiresIn!: number;
}

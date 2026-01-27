import { UserModel } from "../../models/user.model";

import { IAuthResponse } from "../../interfaces/responses/auth-response.interface";

export class AuthResponse implements IAuthResponse {
  user!: Omit<UserModel, "password">;
  accessToken!: string;
  refreshToken!: string;
  expiresIn!: number;
  refreshExpiresIn!: number;
}

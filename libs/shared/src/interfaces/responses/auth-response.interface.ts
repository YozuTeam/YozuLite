import { UserResponse } from "src/dto/responses/user-response.dto";

export interface IAuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

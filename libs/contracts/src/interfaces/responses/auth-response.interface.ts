import { IUserResponse } from "./user-response.interface";

export interface IAuthResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

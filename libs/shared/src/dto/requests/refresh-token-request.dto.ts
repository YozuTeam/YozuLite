import { IsString } from "class-validator";

import { IRefreshTokenRequest } from "../../interfaces/requests/refresh-token-request.interface";

export class RefreshTokenRequest implements IRefreshTokenRequest {
  @IsString()
  refreshToken!: string;
}

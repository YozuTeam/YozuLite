import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IRefreshTokenRequest } from "../../interfaces/requests/refresh-token-request.interface";

export class RefreshTokenRequest implements IRefreshTokenRequest {
  @ApiProperty({
    description: "Refresh token obtained from login or previous refresh",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsString()
  refreshToken!: string;
}

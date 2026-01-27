import { ApiProperty } from "@nestjs/swagger";
import { IAuthResponse } from "../../interfaces/responses/auth-response.interface";
import { UserResponse } from "./user-response.dto";

export class AuthResponse implements IAuthResponse {
  @ApiProperty({
    description: "User information (without password)",
    type: UserResponse,
  })
  user!: UserResponse;

  @ApiProperty({
    description: "JWT access token for API authentication",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken!: string;

  @ApiProperty({
    description: "JWT refresh token for obtaining new access tokens",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  refreshToken!: string;

  @ApiProperty({
    description: "Access token expiration time in seconds",
    example: 900,
  })
  expiresIn!: number;

  @ApiProperty({
    description: "Refresh token expiration time in seconds",
    example: 604800,
  })
  refreshExpiresIn!: number;
}

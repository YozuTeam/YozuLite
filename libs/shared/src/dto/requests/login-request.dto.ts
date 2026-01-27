import { IsString } from "class-validator";

import { ILoginRequest } from "../../interfaces/requests/login-request.interface";

export class LoginRequest implements ILoginRequest {
  @IsString()
  emailOrPhone!: string;

  @IsString()
  password!: string;
}

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Role } from "../../enums/role.enums";

import { IRegisterRequest } from "../../interfaces/requests/register-request.interface";

export class RegisterRequest implements IRegisterRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  phoneNumber!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { Role } from "@yozu/contracts";

import { ICreateUserRequest } from "@yozu/contracts";

export class CreateUserRequest implements ICreateUserRequest {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsPhoneNumber("FR") phoneNumber!: string;
  @IsOptional() @IsEnum(Role) role?: Role;
}

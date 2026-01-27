import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { Role } from "../../enums/role.enums";

import { ICreateUserRequest } from "../../interfaces/requests/create-user-request.interface";

export class CreateUserRequest implements ICreateUserRequest {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsPhoneNumber("FR") phoneNumber!: string;
  @IsOptional() @IsEnum(Role) role?: Role;
}

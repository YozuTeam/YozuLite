import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { Role } from "../../enums/role.enums";

import { IUpdateUserRequest } from "../../interfaces/requests/update-user-request.interface";

export class UpdateUserRequest implements IUpdateUserRequest {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(6) password?: string;
  @IsOptional() @IsPhoneNumber("FR") phoneNumber?: string;
  @IsOptional() @IsEnum(Role) role?: Role;
}

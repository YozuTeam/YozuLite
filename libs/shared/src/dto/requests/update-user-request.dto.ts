import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { Role } from "@yozu/contracts";
import { IUpdateUserRequest } from "@yozu/contracts";

export class UpdateUserRequest implements IUpdateUserRequest {
  @ApiPropertyOptional({
    description: "New email address",
    example: "newemail@doe.com",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: "New password (minimum 6 characters)",
    example: "NewSecret123!",
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: "New phone number (FR format)",
    example: "+33611111111",
  })
  @IsOptional()
  @IsPhoneNumber("FR")
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: "New role (admin only)",
    enum: Role,
    example: Role.STUDENT,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

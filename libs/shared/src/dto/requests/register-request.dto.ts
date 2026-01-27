import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Role } from "@yozu/contracts";
import { IRegisterRequest } from "@yozu/contracts";

export class RegisterRequest implements IRegisterRequest {
  @ApiProperty({
    description: "Email address of the user",
    example: "john@doe.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "Password (minimum 8 characters)",
    example: "Secret123!",
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    description: "Phone number of the user",
    example: "+33600000000",
  })
  @IsString()
  phoneNumber!: string;

  @ApiPropertyOptional({
    description: "Role of the user (defaults to STUDENT)",
    enum: Role,
    example: Role.STUDENT,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

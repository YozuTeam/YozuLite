import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Role } from '@/common/enums/role.enums';

export class RegisterDto {
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

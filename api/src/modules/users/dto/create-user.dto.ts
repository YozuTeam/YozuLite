import { Role } from '@/common/enums/role.enums';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsPhoneNumber('FR') phoneNumber!: string;
  @IsOptional() @IsEnum(Role) role?: Role;
}

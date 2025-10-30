import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateStudentProfileDto {
  @IsString() userId!: string;
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsOptional() @IsString() bio?: string | null;
  @IsOptional() @IsString() school?: string | null;
  @IsOptional() @IsArray() skills?: string[];
}

export class UpdateStudentProfileDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() bio?: string | null;
  @IsOptional() @IsString() school?: string | null;
  @IsOptional() @IsArray() skills?: string[];
}

import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateCompanyProfileDto {
  @IsString() userId!: string;
  @IsString() companyName!: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsString() industry?: string | null;
  @IsOptional() @IsArray() techStack?: string[];
}

export class UpdateCompanyProfileDto {
  @IsOptional() @IsString() companyName?: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsString() industry?: string | null;
  @IsOptional() @IsArray() techStack?: string[];
}

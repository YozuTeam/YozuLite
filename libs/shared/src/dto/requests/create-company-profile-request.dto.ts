import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { ICreateCompanyProfileRequest } from "../../interfaces/requests/create-company-profile-request.interface";

export class CreateCompanyProfileRequest implements ICreateCompanyProfileRequest {
  @ApiProperty({
    description: "Name of the company",
    example: "Acme Corp",
  })
  @IsString()
  companyName!: string;

  @ApiPropertyOptional({
    description: "Description of the company",
    example: "Leading tech company in AI solutions",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({
    description: "Industry sector",
    example: "Technology",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  industry?: string | null;

  @ApiPropertyOptional({
    description: "Technology stack used by the company",
    example: ["NestJS", "React", "PostgreSQL", "Kafka"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  techStack?: string[];
}

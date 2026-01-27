import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { ICreateCompanyProfileRequest } from "@yozu/contracts";

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
    description: "Required competences for candidates",
    example: ["TypeScript", "React", "PostgreSQL"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  competences?: string[];

  @ApiPropertyOptional({
    description: "Types of contracts offered by the company",
    example: ["CDI", "CDD", "Alternance"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  contractType?: string[];
}

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { IUpdateCompanyProfileRequest } from "@yozu/contracts";

export class UpdateCompanyProfileRequest implements IUpdateCompanyProfileRequest {
  @ApiPropertyOptional({
    description: "Updated company name",
    example: "Acme Corporation",
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    description: "Updated description",
    example: "Global leader in AI and ML solutions",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({
    description: "Updated industry sector",
    example: "Artificial Intelligence",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  industry?: string | null;

  @ApiPropertyOptional({
    description: "Updated required competences for candidates",
    example: ["TypeScript", "React", "PostgreSQL", "Redis"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  competences?: string[];

  @ApiPropertyOptional({
    description: "Updated types of contracts offered by the company",
    example: ["CDI", "CDD", "Alternance", "Stage"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  contractType?: string[];
}

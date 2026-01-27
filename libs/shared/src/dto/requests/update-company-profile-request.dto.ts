import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { IUpdateCompanyProfileRequest } from "../../interfaces/requests/update-company-profile-request.interface";

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
    description: "Updated technology stack",
    example: ["NestJS", "React", "PostgreSQL", "Kafka", "Redis"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  techStack?: string[];
}

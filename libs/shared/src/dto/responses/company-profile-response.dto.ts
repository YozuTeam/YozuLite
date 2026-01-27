import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ICompanyProfileResponse } from "@yozu/contracts";

export class CompanyProfileResponse implements ICompanyProfileResponse {
  @ApiProperty({
    description: "Unique identifier of the company profile",
    example: "c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20",
  })
  id!: string;

  @ApiProperty({
    description: "User ID linked to this profile",
    example: "a7c1b3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  })
  userId!: string;

  @ApiProperty({
    description: "Name of the company",
    example: "Acme Corp",
  })
  companyName!: string;

  @ApiPropertyOptional({
    description: "Description of the company",
    example: "Leading tech company in AI solutions",
    nullable: true,
  })
  description!: string | null;

  @ApiPropertyOptional({
    description: "Industry sector",
    example: "Technology",
    nullable: true,
  })
  industry!: string | null;

  @ApiProperty({
    description: "Required competences for candidates",
    example: ["TypeScript", "React", "PostgreSQL"],
    type: [String],
  })
  competences!: string[];

  @ApiProperty({
    description: "Types of contracts offered by the company",
    example: ["CDI", "CDD", "Alternance"],
    type: [String],
  })
  contractType!: string[];
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { ICreateStudentProfileRequest } from "@yozu/contracts";

export class CreateStudentProfileRequest implements ICreateStudentProfileRequest {
  @ApiProperty({
    description: "First name of the student",
    example: "Jane",
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: "Last name of the student",
    example: "Doe",
  })
  @IsString()
  lastName!: string;

  @ApiPropertyOptional({
    description: "Short biography of the student",
    example: "Passionate developer with 3 years of experience",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  bio?: string | null;

  @ApiPropertyOptional({
    description: "Types of contracts the student is looking for",
    example: ["CDI", "Alternance", "Stage"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  contractType?: string[];

  @ApiPropertyOptional({
    description: "List of skills",
    example: ["TypeScript", "Node.js", "React"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  skills?: string[];
}

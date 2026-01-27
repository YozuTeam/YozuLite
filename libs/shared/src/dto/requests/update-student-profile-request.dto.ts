import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { IUpdateStudentProfileRequest } from "../../interfaces/requests/update-student-profile-request.interface";

export class UpdateStudentProfileRequest implements IUpdateStudentProfileRequest {
  @ApiPropertyOptional({
    description: "Updated first name",
    example: "Jane",
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: "Updated last name",
    example: "Doe",
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: "Updated biography",
    example: "Senior developer with 5 years of experience",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  bio?: string | null;

  @ApiPropertyOptional({
    description: "Updated school or university",
    example: "42 Paris",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  school?: string | null;

  @ApiPropertyOptional({
    description: "Updated list of skills",
    example: ["TypeScript", "Node.js", "NestJS", "React"],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  skills?: string[];
}

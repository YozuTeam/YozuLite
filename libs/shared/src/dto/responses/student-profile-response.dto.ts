import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IStudentProfileResponse } from "../../interfaces/responses/student-profile-response.interface";

export class StudentProfileResponse implements IStudentProfileResponse {
  @ApiProperty({
    description: "Unique identifier of the student profile",
    example: "c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20",
  })
  id!: string;

  @ApiProperty({
    description: "User ID linked to this profile",
    example: "a7c1b3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  })
  userId!: string;

  @ApiProperty({
    description: "First name of the student",
    example: "Jane",
  })
  firstName!: string;

  @ApiProperty({
    description: "Last name of the student",
    example: "Doe",
  })
  lastName!: string;

  @ApiPropertyOptional({
    description: "Biography of the student",
    example: "Passionate developer with 3 years of experience",
    nullable: true,
  })
  bio!: string | null;

  @ApiPropertyOptional({
    description: "School or university",
    example: "EPITECH Paris",
    nullable: true,
  })
  school!: string | null;

  @ApiProperty({
    description: "List of skills",
    example: ["TypeScript", "Node.js", "React"],
    type: [String],
  })
  skills!: string[];
}

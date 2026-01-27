import { ApiProperty } from "@nestjs/swagger";
import { OnboardingStep } from "@yozu/contracts";
import { Role } from "@yozu/contracts";
import { IUserResponse } from "@yozu/contracts";

export class UserResponse implements IUserResponse {
  @ApiProperty({
    description: "Unique identifier of the user",
    example: "c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20",
  })
  id!: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "john@doe.com",
  })
  email!: string;

  @ApiProperty({
    description: "Role of the user",
    enum: Role,
    example: Role.STUDENT,
  })
  role!: Role;

  @ApiProperty({
    description: "Current onboarding step of the user",
    enum: OnboardingStep,
    example: OnboardingStep.REGISTERED,
  })
  onboardingStep!: OnboardingStep;

  @ApiProperty({
    description: "Phone number of the user",
    example: "+33600000000",
  })
  phoneNumber!: string;

  @ApiProperty({
    description: "Creation timestamp",
    example: "2025-08-13T12:34:56.000Z",
  })
  createdAt!: Date;

  @ApiProperty({
    description: "Last update timestamp",
    example: "2025-08-13T12:34:56.000Z",
  })
  updatedAt!: Date;
}

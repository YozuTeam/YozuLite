import { ApiProperty } from "@nestjs/swagger";
import { OnboardingStep } from "../../enums/onboarding-step.enum";
import { IOnboardingStatusResponse } from "../../interfaces/responses/onboarding-status-response.interface";

export class OnboardingStatusResponse implements IOnboardingStatusResponse {
  @ApiProperty({
    description: "Current onboarding step of the user",
    enum: OnboardingStep,
    example: OnboardingStep.PROFILE_COMPLETED,
  })
  step!: OnboardingStep;

  @ApiProperty({
    description:
      "Numeric representation of the step (1 = REGISTERED, 2 = PROFILE_PENDING, 3 = PROFILE_COMPLETED)",
    example: 3,
    minimum: 1,
    maximum: 3,
  })
  stepNumber!: number;

  @ApiProperty({
    description: "Human-readable label for the current step",
    example: "Profil complété",
  })
  label!: string;

  @ApiProperty({
    description: "Whether the user has completed the onboarding process",
    example: true,
  })
  isCompleted!: boolean;
}

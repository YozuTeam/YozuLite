import { OnboardingStep } from "../../enums/onboarding-step.enum";

export interface IOnboardingStatusResponse {
  /** Current onboarding step of the user */
  step: OnboardingStep;

  /** Numeric representation of the step (1, 2, or 3) */
  stepNumber: number;

  /** Human-readable label for the step */
  label: string;

  /** Whether the user has completed onboarding */
  isCompleted: boolean;
}

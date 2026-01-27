import { OnboardingStep } from "../../enums/onboarding-step.enum";
import { Role } from "../../enums/role.enums";

export interface IUserResponse {
  id: string;
  email: string;
  role: Role;
  onboardingStep: OnboardingStep;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

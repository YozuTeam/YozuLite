import { OnboardingStep } from "../enums/onboarding-step.enum";
import { Role } from "../enums/role.enums";

export class UserModel {
  constructor(
    public readonly id: string,
    public email: string,
    public role: Role,
    public onboardingStep: OnboardingStep,
    public password: string,
    public phoneNumber: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isCompany() {
    return this.role === Role.COMPANY;
  }
  isStudent() {
    return this.role === Role.STUDENT;
  }
}

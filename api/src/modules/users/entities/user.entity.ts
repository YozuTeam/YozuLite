import { OnboardingStep, Role } from '@yozu/shared';

export class UserEntity {
  id!: string;
  email!: string;
  password!: string;
  phoneNumber!: string;
  role!: Role;
  onboardingStep!: OnboardingStep;
  createdAt!: Date;
  updatedAt!: Date;
  constructor(
    id: string,
    email: string,
    password: string,
    phoneNumber: string,
    role: Role,
    onboardingStep: OnboardingStep,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.role = role;
    this.onboardingStep = onboardingStep;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

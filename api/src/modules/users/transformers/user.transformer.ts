import { Prisma, User as PrismaUser } from '@prisma/client';
import { OnboardingStep, Role, UserModel } from '@yozu/shared';
import { UserEntity } from '../entities/user.entity';

export const UserTransformer = {
  fromPrisma(p: PrismaUser): UserEntity {
    return {
      id: p.id,
      email: p.email,
      password: p.password,
      phoneNumber: p.phoneNumber,
      role: p.role as unknown as Role,
      onboardingStep: p.onboardingStep as unknown as OnboardingStep,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  },

  toModel(e: UserEntity): UserModel {
    return new UserModel(
      e.id,
      e.email,
      e.role,
      e.onboardingStep,
      e.password,
      e.phoneNumber,
      e.createdAt,
      e.updatedAt,
    );
  },

  toPrismaCreate(input: {
    email: string;
    password: string;
    phoneNumber: string;
    role?: Role;
  }): Prisma.UserCreateInput {
    return {
      email: input.email,
      password: input.password,
      phoneNumber: input.phoneNumber,
      role: input.role ?? Role.STUDENT,
      onboardingStep: OnboardingStep.REGISTERED,
    };
  },
};

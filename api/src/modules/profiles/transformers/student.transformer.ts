import { Prisma } from '@prisma/client';
import { StudentProfileEntity } from '../entities/student.entity';
import { StudentProfileModel } from '../models/student.model';

export const StudentTransformer = {
  toModel(e: StudentProfileEntity): StudentProfileModel {
    return new StudentProfileModel(
      e.id,
      e.userId,
      e.firstName,
      e.lastName,
      e.bio ?? null,
      e.contractType,
      e.skills,
    );
  },

  toPrismaCreate(input: {
    userId: string;
    firstName: string;
    lastName: string;
    bio?: string | null;
    contractType?: string[];
    skills?: string[];
  }): Prisma.StudentProfileCreateInput {
    return {
      user: { connect: { id: input.userId } },
      firstName: input.firstName,
      lastName: input.lastName,
      bio: input.bio ?? null,
      contractType: input.contractType ?? [],
      skills: input.skills ?? [],
    };
  },

  toPrismaUpdate(
    input: Partial<{
      firstName?: string;
      lastName?: string;
      bio?: string | null;
      contractType?: string[];
      skills?: string[];
    }>,
  ): Prisma.StudentProfileUpdateInput {
    return {
      ...input,
    };
  },
};

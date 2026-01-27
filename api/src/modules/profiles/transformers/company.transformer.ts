import { Prisma } from '@prisma/client';
import { CompanyProfileEntity } from '../entities/company.entity';
import { CompanyProfileModel } from '../models/company.model';

export const CompanyTransformer = {
  toModel(e: CompanyProfileEntity): CompanyProfileModel {
    return new CompanyProfileModel(
      e.id,
      e.userId,
      e.companyName,
      e.description ?? null,
      e.industry ?? null,
      e.competences,
      e.contractType,
    );
  },

  toPrismaCreate(input: {
    userId: string;
    companyName: string;
    description?: string | null;
    industry?: string | null;
    competences?: string[];
    contractType?: string[];
  }): Prisma.CompanyProfileCreateInput {
    return {
      user: { connect: { id: input.userId } },
      companyName: input.companyName,
      description: input.description ?? null,
      industry: input.industry ?? null,
      competences: input.competences ?? [],
      contractType: input.contractType ?? [],
    };
  },

  toPrismaUpdate(
    input: Partial<{
      companyName: string;
      description: string | null;
      industry: string | null;
      competences: string[];
      contractType: string[];
    }>,
  ): Prisma.CompanyProfileUpdateInput {
    return { ...input };
  },
};

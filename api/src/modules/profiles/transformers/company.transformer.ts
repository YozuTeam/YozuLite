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
      e.techStack,
    );
  },

  toPrismaCreate(input: {
    userId: string;
    companyName: string;
    description?: string | null;
    industry?: string | null;
    techStack?: string[];
    hiringCriteria?: Record<string, unknown> | null;
  }) {
    return {
      userId: input.userId,
      companyName: input.companyName,
      description: input.description ?? null,
      industry: input.industry ?? null,
      techStack: input.techStack ?? [],
      hiringCriteria: input.hiringCriteria ?? null,
    };
  },

  toPrismaUpdate(
    input: Partial<{
      companyName: string;
      description: string | null;
      industry: string | null;
      techStack: string[];
      hiringCriteria: Record<string, unknown> | null;
    }>,
  ) {
    return { ...input };
  },
};

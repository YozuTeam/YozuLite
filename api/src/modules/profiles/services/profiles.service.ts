import { PrismaService } from '@/infra/database/database.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCompanyProfileRequest,
  CreateStudentProfileRequest,
  OnboardingStep,
  UpdateCompanyProfileRequest,
  UpdateStudentProfileRequest,
} from '@yozu/shared';

import {
  CompanyProfile as PrismaCompany,
  StudentProfile as PrismaStudent,
} from '@prisma/client';

import { CompanyProfileEntity } from '../entities/company.entity';
import { StudentProfileEntity } from '../entities/student.entity';

import { CompanyProfileModel } from '../models/company.model';
import { StudentProfileModel } from '../models/student.model';

import { CompanyTransformer } from '../transformers/company.transformer';
import { StudentTransformer } from '../transformers/student.transformer';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  private studentRecordToEntity(p: PrismaStudent): StudentProfileEntity {
    return new StudentProfileEntity(
      p.id,
      p.userId,
      p.firstName,
      p.lastName,
      p.bio ?? null,
      p.school ?? null,
      Array.isArray(p.skills) ? p.skills : [],
    );
  }

  private companyRecordToEntity(p: PrismaCompany): CompanyProfileEntity {
    return new CompanyProfileEntity(
      p.id,
      p.userId,
      p.companyName,
      p.description ?? null,
      p.industry ?? null,
      Array.isArray(p.techStack) ? p.techStack : [],
    );
  }

  private toStudentModel(p: PrismaStudent): StudentProfileModel {
    return StudentTransformer.toModel(this.studentRecordToEntity(p));
  }

  private toCompanyModel(p: PrismaCompany): CompanyProfileModel {
    return CompanyTransformer.toModel(this.companyRecordToEntity(p));
  }

  async createStudent(
    dto: CreateStudentProfileRequest,
    userId: string,
  ): Promise<StudentProfileModel> {
    const exists = await this.prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (exists) throw new ConflictException('Student profile already exists');

    const data = StudentTransformer.toPrismaCreate({
      userId: userId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      bio: dto.bio ?? null,
      school: dto.school ?? null,
      skills: dto.skills ?? [],
    });

    const created = await this.prisma.studentProfile.create({ data });

    // Update user's onboarding step to PROFILE_COMPLETED
    await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: OnboardingStep.PROFILE_COMPLETED },
    });

    return this.toStudentModel(created);
  }

  async updateStudent(
    userId: string,
    dto: UpdateStudentProfileRequest,
  ): Promise<StudentProfileModel> {
    await this.ensureStudentExists(userId);
    const data = StudentTransformer.toPrismaUpdate({
      firstName: dto.firstName,
      lastName: dto.lastName,
      bio: dto.bio,
      school: dto.school,
      skills: dto.skills,
    });
    const updated = await this.prisma.studentProfile.update({
      where: { userId },
      data,
    });
    return this.toStudentModel(updated);
  }

  async getStudent(userId: string): Promise<StudentProfileModel> {
    const s = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });
    if (!s) throw new NotFoundException('Student profile not found');
    return this.toStudentModel(s);
  }

  async listStudents(): Promise<StudentProfileModel[]> {
    const list = await this.prisma.studentProfile.findMany({
      orderBy: { id: 'desc' },
    });
    return list.map((p) => this.toStudentModel(p));
  }

  async deleteStudent(userId: string): Promise<{ success: true }> {
    await this.ensureStudentExists(userId);
    await this.prisma.studentProfile.delete({ where: { userId } });
    return { success: true };
  }

  private async ensureStudentExists(userId: string) {
    const ok = await this.prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!ok) throw new NotFoundException('Student profile not found');
  }

  async createCompany(
    dto: CreateCompanyProfileRequest,
    userId: string,
  ): Promise<CompanyProfileModel> {
    const exists = await this.prisma.companyProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (exists) throw new ConflictException('Company profile already exists');

    const data = CompanyTransformer.toPrismaCreate({
      userId: userId,
      companyName: dto.companyName,
      description: dto.description ?? null,
      industry: dto.industry ?? null,
      techStack: dto.techStack ?? [],
    });

    const created = await this.prisma.companyProfile.create({ data });

    await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: OnboardingStep.PROFILE_COMPLETED },
    });

    return this.toCompanyModel(created);
  }

  async updateCompany(
    userId: string,
    dto: UpdateCompanyProfileRequest,
  ): Promise<CompanyProfileModel> {
    await this.ensureCompanyExists(userId);
    const data = CompanyTransformer.toPrismaUpdate({
      companyName: dto.companyName,
      description: dto.description ?? null,
      industry: dto.industry ?? null,
      techStack: dto.techStack,
    });
    const updated = await this.prisma.companyProfile.update({
      where: { userId },
      data,
    });
    return this.toCompanyModel(updated);
  }

  async getCompany(id: string): Promise<CompanyProfileModel> {
    const c = await this.prisma.companyProfile.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Company profile not found');
    return this.toCompanyModel(c);
  }

  async listCompanies(): Promise<CompanyProfileModel[]> {
    const list = await this.prisma.companyProfile.findMany({
      orderBy: { id: 'desc' },
    });
    return list.map((p) => this.toCompanyModel(p));
  }

  async deleteCompany(userId: string): Promise<{ success: true }> {
    await this.ensureCompanyExists(userId);
    await this.prisma.companyProfile.delete({ where: { userId } });
    return { success: true };
  }

  private async ensureCompanyExists(userId: string) {
    const ok = await this.prisma.companyProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!ok) throw new NotFoundException('Company profile not found');
  }

  async getStudentOnboardingStatus(userId: string): Promise<{
    step: OnboardingStep;
    stepNumber: number;
    label: string;
    isCompleted: boolean;
  }> {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (profile) {
      return {
        step: OnboardingStep.PROFILE_COMPLETED,
        stepNumber: 3,
        label: 'Profil complété',
        isCompleted: true,
      };
    }

    return {
      step: OnboardingStep.REGISTERED,
      stepNumber: 1,
      label: 'Inscrit - En attente de création de profil',
      isCompleted: false,
    };
  }

  async getCompanyOnboardingStatus(userId: string): Promise<{
    step: OnboardingStep;
    stepNumber: number;
    label: string;
    isCompleted: boolean;
  }> {
    const profile = await this.prisma.companyProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (profile) {
      return {
        step: OnboardingStep.PROFILE_COMPLETED,
        stepNumber: 3,
        label: 'Profil complété',
        isCompleted: true,
      };
    }

    return {
      step: OnboardingStep.REGISTERED,
      stepNumber: 1,
      label: 'Inscrit - En attente de création de profil',
      isCompleted: false,
    };
  }
}

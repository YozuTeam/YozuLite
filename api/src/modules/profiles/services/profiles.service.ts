import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../infra/database/database.service';
import {
  CreateStudentProfileDto,
  UpdateStudentProfileDto,
} from '../dto/student-profile.dto';
import {
  CreateCompanyProfileDto,
  UpdateCompanyProfileDto,
} from '../dto/company-profile.dto';

import {
  StudentProfile as PrismaStudent,
  CompanyProfile as PrismaCompany,
} from '@generated/prisma';

import { StudentProfileEntity } from '../entities/student.entity';
import { CompanyProfileEntity } from '../entities/company.entity';

import { StudentProfileModel } from '../models/student.model';
import { CompanyProfileModel } from '../models/company.model';

import { StudentTransformer } from '../transformers/student.transformer';
import { CompanyTransformer } from '../transformers/company.transformer';

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
    dto: CreateStudentProfileDto,
  ): Promise<StudentProfileModel> {
    const exists = await this.prisma.studentProfile.findUnique({
      where: { userId: dto.userId },
      select: { id: true },
    });
    if (exists) throw new ConflictException('Student profile already exists');

    const data = StudentTransformer.toPrismaCreate({
      userId: dto.userId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      bio: dto.bio ?? null,
      school: dto.school ?? null,
      skills: dto.skills ?? [],
    });

    const created = await this.prisma.studentProfile.create({ data });
    return this.toStudentModel(created);
  }

  async updateStudent(
    id: number,
    dto: UpdateStudentProfileDto,
  ): Promise<StudentProfileModel> {
    await this.ensureStudentExists(id);
    const data = StudentTransformer.toPrismaUpdate({
      firstName: dto.firstName,
      lastName: dto.lastName,
      bio: dto.bio,
      school: dto.school,
      skills: dto.skills,
    });
    const updated = await this.prisma.studentProfile.update({
      where: { id },
      data,
    });
    return this.toStudentModel(updated);
  }

  async getStudent(id: number): Promise<StudentProfileModel> {
    const s = await this.prisma.studentProfile.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Student profile not found');
    return this.toStudentModel(s);
  }

  async listStudents(): Promise<StudentProfileModel[]> {
    const list = await this.prisma.studentProfile.findMany({
      orderBy: { id: 'desc' },
    });
    return list.map((p) => this.toStudentModel(p));
  }

  async deleteStudent(id: number): Promise<{ success: true }> {
    await this.ensureStudentExists(id);
    await this.prisma.studentProfile.delete({ where: { id } });
    return { success: true };
  }

  private async ensureStudentExists(id: number) {
    const ok = await this.prisma.studentProfile.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!ok) throw new NotFoundException('Student profile not found');
  }

  // ===================== COMPANY =====================

  async createCompany(
    dto: CreateCompanyProfileDto,
  ): Promise<CompanyProfileModel> {
    const exists = await this.prisma.companyProfile.findUnique({
      where: { userId: dto.userId },
      select: { id: true },
    });
    if (exists) throw new ConflictException('Company profile already exists');

    const data = CompanyTransformer.toPrismaCreate({
      userId: dto.userId,
      companyName: dto.companyName,
      description: dto.description ?? null,
      industry: dto.industry ?? null,
      techStack: dto.techStack ?? [],
    });

    const created = await this.prisma.companyProfile.create({ data });
    return this.toCompanyModel(created);
  }

  async updateCompany(
    id: number,
    dto: UpdateCompanyProfileDto,
  ): Promise<CompanyProfileModel> {
    await this.ensureCompanyExists(id);
    const data = CompanyTransformer.toPrismaUpdate({
      companyName: dto.companyName,
      description: dto.description ?? null,
      industry: dto.industry ?? null,
      techStack: dto.techStack,
    });
    const updated = await this.prisma.companyProfile.update({
      where: { id },
      data,
    });
    return this.toCompanyModel(updated);
  }

  async getCompany(id: number): Promise<CompanyProfileModel> {
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

  async deleteCompany(id: number): Promise<{ success: true }> {
    await this.ensureCompanyExists(id);
    await this.prisma.companyProfile.delete({ where: { id } });
    return { success: true };
  }

  private async ensureCompanyExists(id: number) {
    const ok = await this.prisma.companyProfile.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!ok) throw new NotFoundException('Company profile not found');
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateStudentProfileRequest,
  Role,
  UpdateStudentProfileRequest,
} from '@yozu/shared';
import { ProfilesService } from '../services/profiles.service';

import { AuthUser, Roles } from '@/common/auth/auth.decorators';
import { AuthJwtPayload } from '@/common/auth/auth.types';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('profiles/students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  private readonly logger = new Logger(StudentController.name);

  constructor(private readonly svc: ProfilesService) {}

  @Roles(Role.STUDENT)
  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  async createMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: CreateStudentProfileRequest,
  ) {
    this.logger.debug(`POST /profiles/students/me - userId=${user.sub}`);
    this.logger.verbose(
      `Received CreateStudentProfileRequest: ${JSON.stringify(dto)}`,
    );

    try {
      const result = await this.svc.createStudent(dto, user.sub);
      this.logger.log(
        `Student profile created successfully for user ${user.sub}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error while creating student profile for ${user.sub}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Roles(Role.STUDENT)
  @Get('me')
  async getMe(@AuthUser() user: AuthJwtPayload) {
    this.logger.debug(`GET /profiles/students/me - userId=${user.sub}`);
    try {
      const result = await this.svc.getStudent(user.sub);
      this.logger.log(`Fetched profile for student ${user.sub}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error fetching student profile for ${user.sub}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Roles(Role.STUDENT)
  @Patch('me')
  async updateMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: UpdateStudentProfileRequest,
  ) {
    this.logger.debug(`PATCH /profiles/students/me - userId=${user.sub}`);
    this.logger.verbose(`UpdateStudentProfileRequest: ${JSON.stringify(dto)}`);

    try {
      const result = await this.svc.updateStudent(user.sub, dto);
      this.logger.log(`Student ${user.sub} profile updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error updating student profile for ${user.sub}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Roles(Role.STUDENT)
  @Delete('me')
  async removeMe(@AuthUser() user: AuthJwtPayload) {
    this.logger.debug(`DELETE /profiles/students/me - userId=${user.sub}`);

    try {
      const result = await this.svc.deleteStudent(user.sub);
      this.logger.log(`Deleted student profile for user ${user.sub}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error deleting student profile for ${user.sub}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Roles(Role.ADMIN, Role.STUDENT)
  @Get()
  async listAll() {
    this.logger.debug(`GET /profiles/students (admin access)`);
    try {
      const result = await this.svc.listStudents();
      this.logger.log(`Fetched ${result.length} student profiles`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error listing student profiles: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async getById(@Param('id') id: string) {
    this.logger.debug(`GET /profiles/students/${id} (admin access)`);
    try {
      const result = await this.svc.getStudent(id);
      this.logger.log(`Fetched student profile id=${id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error fetching student ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateStudentProfileRequest,
  ) {
    this.logger.debug(`PATCH /profiles/students/${id} (admin access)`);
    this.logger.verbose(`UpdateStudentProfileDto: ${JSON.stringify(dto)}`);

    try {
      const result = await this.svc.updateStudent(id, dto);
      this.logger.log(`Updated student profile id=${id} successfully`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error updating student ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    this.logger.debug(`DELETE /profiles/students/${id} (admin access)`);
    try {
      const result = await this.svc.deleteStudent(id);
      this.logger.log(`Deleted student profile id=${id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error deleting student ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}

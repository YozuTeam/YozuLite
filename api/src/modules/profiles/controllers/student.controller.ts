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
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateStudentProfileRequest,
  DeleteResponse,
  OnboardingStatusResponse,
  Role,
  StudentProfileResponse,
  UpdateStudentProfileRequest,
} from '@yozu/shared';
import { ProfilesService } from '../services/profiles.service';

import { AuthUser, Roles } from '@/common/auth/auth.decorators';
import { AuthJwtPayload } from '@/common/auth/auth.types';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('Students')
@ApiBearerAuth('bearerAuth')
@Controller('profiles/students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
  private readonly logger = new Logger(StudentController.name);

  constructor(private readonly svc: ProfilesService) {}

  // ========================
  // ONBOARDING STATUS
  // ========================

  @ApiOperation({
    summary: 'Get onboarding status',
    description:
      'Returns the current onboarding step of the authenticated user.\n\n**Rôle requis:** `ADMIN`, `STUDENT` ou `COMPANY`',
  })
  @ApiOkResponse({
    description: 'Onboarding status retrieved successfully',
    type: OnboardingStatusResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @Roles(Role.ADMIN, Role.STUDENT, Role.COMPANY)
  @Get('onboarding-status')
  async getOnboardingStatus(
    @AuthUser() user: AuthJwtPayload,
  ): Promise<OnboardingStatusResponse> {
    this.logger.debug(
      `GET /profiles/students/onboarding-status - userId=${user.sub}`,
    );
    return this.svc.getStudentOnboardingStatus(user.sub);
  }

  // ========================
  // STUDENT OWN PROFILE
  // ========================

  @ApiOperation({
    summary: 'Create my student profile',
    description:
      'Creates a student profile for the currently authenticated user. Each user can only have one student profile.\n\n**Rôle requis:** `STUDENT`',
  })
  @ApiBody({ type: CreateStudentProfileRequest })
  @ApiCreatedResponse({
    description: 'Student profile created successfully',
    type: StudentProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have student role',
  })
  @ApiConflictResponse({
    description: 'Student profile already exists for this user',
  })
  @Roles(Role.STUDENT)
  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  async createMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: CreateStudentProfileRequest,
  ): Promise<StudentProfileResponse> {
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

  @ApiOperation({
    summary: 'Get my student profile',
    description:
      'Returns the student profile of the currently authenticated user.\n\n**Rôle requis:** `STUDENT`',
  })
  @ApiOkResponse({
    description: 'Student profile retrieved successfully',
    type: StudentProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have student role',
  })
  @ApiNotFoundResponse({
    description: 'Student profile not found',
  })
  @Roles(Role.STUDENT)
  @Get('me')
  async getMe(
    @AuthUser() user: AuthJwtPayload,
  ): Promise<StudentProfileResponse> {
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

  @ApiOperation({
    summary: 'Update my student profile',
    description:
      'Updates the student profile of the currently authenticated user. All fields are optional.\n\n**Rôle requis:** `STUDENT`',
  })
  @ApiBody({ type: UpdateStudentProfileRequest })
  @ApiOkResponse({
    description: 'Student profile updated successfully',
    type: StudentProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have student role',
  })
  @ApiNotFoundResponse({
    description: 'Student profile not found',
  })
  @Roles(Role.STUDENT)
  @Patch('me')
  async updateMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: UpdateStudentProfileRequest,
  ): Promise<StudentProfileResponse> {
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

  @ApiOperation({
    summary: 'Delete my student profile',
    description:
      'Permanently deletes the student profile of the currently authenticated user.\n\n**Rôle requis:** `STUDENT`',
  })
  @ApiOkResponse({
    description: 'Student profile deleted successfully',
    type: DeleteResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have student role',
  })
  @ApiNotFoundResponse({
    description: 'Student profile not found',
  })
  @Roles(Role.STUDENT)
  @Delete('me')
  async removeMe(@AuthUser() user: AuthJwtPayload): Promise<DeleteResponse> {
    this.logger.debug(`DELETE /profiles/students/me - userId=${user.sub}`);

    try {
      const result = await this.svc.deleteStudentByUserId(user.sub);
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

  // ========================
  // LIST ALL (ADMIN/STUDENT)
  // ========================

  @ApiOperation({
    summary: 'List all student profiles',
    description:
      'Returns a list of all student profiles. Available to admins and companies.\n\n**Rôle requis:** `ADMIN` ou `COMPANY`',
  })
  @ApiOkResponse({
    description: 'List of student profiles',
    type: [StudentProfileResponse],
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have required role',
  })
  @Roles(Role.ADMIN, Role.COMPANY)
  @Get()
  async listAll(): Promise<StudentProfileResponse[]> {
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

  // ========================
  // ADMIN ENDPOINTS
  // ========================

  @ApiOperation({
    summary: 'Get student profile by ID (Admin only)',
    description:
      'Returns a specific student profile by ID. Admin access required.\n\n**Rôle requis:** `ADMIN`',
  })
  @ApiParam({
    name: 'id',
    description: 'Student profile ID or User ID (UUID)',
    example: 'c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20',
  })
  @ApiOkResponse({
    description: 'Student profile retrieved successfully',
    type: StudentProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have admin privileges',
  })
  @ApiNotFoundResponse({
    description: 'Student profile not found',
  })
  @Roles(Role.ADMIN)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<StudentProfileResponse> {
    this.logger.debug(`GET /profiles/students/${id} (admin access)`);
    try {
      const result = await this.svc.getStudentById(id);
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

  @ApiOperation({
    summary: 'Update student profile by ID (Admin only)',
    description:
      'Updates a specific student profile by ID. Admin access required.\n\n**Rôle requis:** `ADMIN`',
  })
  @ApiParam({
    name: 'id',
    description: 'Student profile ID or User ID (UUID)',
    example: 'c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20',
  })
  @ApiBody({ type: UpdateStudentProfileRequest })
  @ApiOkResponse({
    description: 'Student profile updated successfully',
    type: StudentProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have admin privileges',
  })
  @ApiNotFoundResponse({
    description: 'Student profile not found',
  })
  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateStudentProfileRequest,
  ): Promise<StudentProfileResponse> {
    this.logger.debug(`PATCH /profiles/students/${id} (admin access)`);
    this.logger.verbose(`UpdateStudentProfileDto: ${JSON.stringify(dto)}`);

    try {
      const result = await this.svc.updateStudentById(id, dto);
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

  @ApiOperation({
    summary: 'Delete student profile by ID (Admin only)',
    description:
      'Permanently deletes a specific student profile by ID. Admin access required.\n\n**Rôle requis:** `ADMIN`',
  })
  @ApiParam({
    name: 'id',
    description: 'Student profile ID or User ID (UUID)',
    example: 'c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20',
  })
  @ApiOkResponse({
    description: 'Student profile deleted successfully',
    type: DeleteResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have admin privileges',
  })
  @ApiNotFoundResponse({
    description: 'Student profile not found',
  })
  @Roles(Role.ADMIN)
  @Delete(':id')
  async removeById(@Param('id') id: string): Promise<DeleteResponse> {
    this.logger.debug(`DELETE /profiles/students/${id} (admin access)`);
    try {
      const result = await this.svc.deleteStudentById(id);
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

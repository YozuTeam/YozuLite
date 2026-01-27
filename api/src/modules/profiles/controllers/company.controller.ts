import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  CompanyProfileResponse,
  CreateCompanyProfileRequest,
  DeleteResponse,
  OnboardingStatusResponse,
  Role,
  UpdateCompanyProfileRequest,
} from '@yozu/shared';
import { ProfilesService } from '../services/profiles.service';

import { AuthUser, Roles } from '@/common/auth/auth.decorators';
import { AuthJwtPayload } from '@/common/auth/auth.types';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('Companies')
@ApiBearerAuth('bearerAuth')
@Controller('profiles/companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
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
  getOnboardingStatus(
    @AuthUser() user: AuthJwtPayload,
  ): Promise<OnboardingStatusResponse> {
    return this.svc.getCompanyOnboardingStatus(user.sub);
  }

  // ========================
  // COMPANY OWN PROFILE
  // ========================

  @ApiOperation({
    summary: 'Create my company profile',
    description:
      'Creates a company profile for the currently authenticated user. Each user can only have one company profile.\n\n**Rôle requis:** `COMPANY`',
  })
  @ApiBody({ type: CreateCompanyProfileRequest })
  @ApiCreatedResponse({
    description: 'Company profile created successfully',
    type: CompanyProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have company role',
  })
  @ApiConflictResponse({
    description: 'Company profile already exists for this user',
  })
  @Roles(Role.COMPANY)
  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  createMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: CreateCompanyProfileRequest,
  ): Promise<CompanyProfileResponse> {
    return this.svc.createCompany(dto, user.sub);
  }

  @ApiOperation({
    summary: 'Get my company profile',
    description:
      'Returns the company profile of the currently authenticated user.\n\n**Rôle requis:** `COMPANY`',
  })
  @ApiOkResponse({
    description: 'Company profile retrieved successfully',
    type: CompanyProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have company role',
  })
  @ApiNotFoundResponse({
    description: 'Company profile not found',
  })
  @Roles(Role.COMPANY)
  @Get('me')
  getMe(@AuthUser() user: AuthJwtPayload): Promise<CompanyProfileResponse> {
    return this.svc.getCompanyByUserId(user.sub);
  }

  @ApiOperation({
    summary: 'Update my company profile',
    description:
      'Updates the company profile of the currently authenticated user. All fields are optional.\n\n**Rôle requis:** `COMPANY`',
  })
  @ApiBody({ type: UpdateCompanyProfileRequest })
  @ApiOkResponse({
    description: 'Company profile updated successfully',
    type: CompanyProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have company role',
  })
  @ApiNotFoundResponse({
    description: 'Company profile not found',
  })
  @Roles(Role.COMPANY)
  @Patch('me')
  updateMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: UpdateCompanyProfileRequest,
  ): Promise<CompanyProfileResponse> {
    return this.svc.updateCompany(user.sub, dto);
  }

  @ApiOperation({
    summary: 'Delete my company profile',
    description:
      'Permanently deletes the company profile of the currently authenticated user.\n\n**Rôle requis:** `COMPANY`',
  })
  @ApiOkResponse({
    description: 'Company profile deleted successfully',
    type: DeleteResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have company role',
  })
  @ApiNotFoundResponse({
    description: 'Company profile not found',
  })
  @Roles(Role.COMPANY)
  @Delete('me')
  removeMe(@AuthUser() user: AuthJwtPayload): Promise<DeleteResponse> {
    return this.svc.deleteCompanyByUserId(user.sub);
  }

  // ========================
  // LIST ALL (ADMIN/STUDENT)
  // ========================

  @ApiOperation({
    summary: 'List all company profiles',
    description:
      'Returns a list of all company profiles. Available to admins and students.\n\n**Rôle requis:** `ADMIN` ou `STUDENT`',
  })
  @ApiOkResponse({
    description: 'List of company profiles',
    type: [CompanyProfileResponse],
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have required role',
  })
  @Roles(Role.ADMIN, Role.STUDENT)
  @Get()
  listAll(): Promise<CompanyProfileResponse[]> {
    return this.svc.listCompanies();
  }

  // ========================
  // ADMIN ENDPOINTS
  // ========================

  @ApiOperation({
    summary: 'Get company profile by ID (Admin only)',
    description:
      'Returns a specific company profile by ID. Admin access required.\n\n**Rôle requis:** `ADMIN`',
  })
  @ApiParam({
    name: 'id',
    description: 'Company profile ID (UUID)',
    example: 'c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20',
  })
  @ApiOkResponse({
    description: 'Company profile retrieved successfully',
    type: CompanyProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have admin privileges',
  })
  @ApiNotFoundResponse({
    description: 'Company profile not found',
  })
  @Roles(Role.ADMIN)
  @Get(':id')
  getById(@Param('id') id: string): Promise<CompanyProfileResponse> {
    return this.svc.getCompanyById(id);
  }

  @ApiOperation({
    summary: 'Update company profile by ID (Admin only)',
    description:
      'Updates a specific company profile by ID. Admin access required.\n\n**Rôle requis:** `ADMIN`',
  })
  @ApiParam({
    name: 'id',
    description: 'Company profile ID (UUID)',
    example: 'c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20',
  })
  @ApiBody({ type: UpdateCompanyProfileRequest })
  @ApiOkResponse({
    description: 'Company profile updated successfully',
    type: CompanyProfileResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have admin privileges',
  })
  @ApiNotFoundResponse({
    description: 'Company profile not found',
  })
  @Roles(Role.ADMIN)
  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyProfileRequest,
  ): Promise<CompanyProfileResponse> {
    return this.svc.updateCompanyById(id, dto);
  }

  @ApiOperation({
    summary: 'Delete company profile by ID (Admin only)',
    description:
      'Permanently deletes a specific company profile by ID. Admin access required.\n\n**Rôle requis:** `ADMIN`',
  })
  @ApiParam({
    name: 'id',
    description: 'Company profile ID (UUID)',
    example: 'c8d0a5d2-2a2e-4c2b-8f46-9f3f8a3a1f20',
  })
  @ApiOkResponse({
    description: 'Company profile deleted successfully',
    type: DeleteResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiForbiddenResponse({
    description: 'User does not have admin privileges',
  })
  @ApiNotFoundResponse({
    description: 'Company profile not found',
  })
  @Roles(Role.ADMIN)
  @Delete(':id')
  removeById(@Param('id') id: string): Promise<DeleteResponse> {
    return this.svc.deleteCompanyById(id);
  }
}

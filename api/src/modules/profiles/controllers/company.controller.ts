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
  CreateCompanyProfileRequest,
  Role,
  UpdateCompanyProfileRequest,
} from '@yozu/shared';
import { ProfilesService } from '../services/profiles.service';

import { AuthUser, Roles } from '@/common/auth/auth.decorators';
import { AuthJwtPayload } from '@/common/auth/auth.types';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('profiles/companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly svc: ProfilesService) {}

  @Roles(Role.COMPANY)
  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  createMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: CreateCompanyProfileRequest,
  ) {
    return this.svc.createCompany(dto, user.sub);
  }

  @Roles(Role.COMPANY)
  @Get('me')
  getMe(@AuthUser() user: AuthJwtPayload) {
    return this.svc.getCompany(user.sub);
  }

  @Roles(Role.COMPANY)
  @Patch('me')
  updateMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: UpdateCompanyProfileRequest,
  ) {
    return this.svc.updateCompany(user.sub, dto);
  }

  @Roles(Role.COMPANY)
  @Delete('me')
  removeMe(@AuthUser() user: AuthJwtPayload) {
    return this.svc.deleteCompany(user.sub);
  }

  @Roles(Role.ADMIN, Role.STUDENT)
  @Get()
  listAll() {
    return this.svc.listCompanies();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.svc.getCompany(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  updateById(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyProfileRequest,
  ) {
    return this.svc.updateCompany(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.svc.deleteCompany(id);
  }
}

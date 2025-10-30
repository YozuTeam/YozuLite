import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from '../services/profiles.service';
import {
  CreateCompanyProfileDto,
  UpdateCompanyProfileDto,
} from '../dto/company-profile.dto';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles, AuthUser } from '@/common/auth/auth.decorators';
import { Role } from '@/common/enums/role.enums';
import { AuthJwtPayload } from '@/common/auth/auth.types';

@Controller('profiles/companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly svc: ProfilesService) {}

  @Roles(Role.COMPANY)
  @Post('me')
  @HttpCode(HttpStatus.CREATED)
  createMe(
    @AuthUser() user: AuthJwtPayload,
    @Body() dto: CreateCompanyProfileDto,
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
    @Body() dto: UpdateCompanyProfileDto,
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
  updateById(@Param('id') id: string, @Body() dto: UpdateCompanyProfileDto) {
    return this.svc.updateCompany(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.svc.deleteCompany(id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { ProfilesService } from '../services/profiles.service';
import {
  CreateCompanyProfileDto,
  UpdateCompanyProfileDto,
} from '../dto/company-profile.dto';

@Controller('profiles/companies')
export class CompanyController {
  constructor(private readonly svc: ProfilesService) {}

  @Post() create(@Body() dto: CreateCompanyProfileDto) {
    return this.svc.createCompany(dto);
  }
  @Get() list() {
    return this.svc.listCompanies();
  }
  @Get(':id') get(@Param('id') id: string) {
    return this.svc.getCompany(Number(id));
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyProfileDto,
  ) {
    return this.svc.updateCompany(Number(id), dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.svc.deleteCompany(Number(id));
  }
}

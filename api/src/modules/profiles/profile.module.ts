import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infra/database/database.module';
import { ProfilesService } from './services/profiles.service';
import { StudentController } from './controllers/student.controller';
import { CompanyController } from './controllers/company.controller';
import { RolesGuard } from '@/common/guards/roles.guard';
import { TokenService } from '@/common/auth/token.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, JwtModule.register({})],
  controllers: [StudentController, CompanyController],
  providers: [ProfilesService, TokenService, RolesGuard, JwtAuthGuard],
})
export class ProfilesModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infra/database/database.module';
import { ProfilesService } from './services/profiles.service';
import { StudentController } from './controllers/student.controller';
import { CompanyController } from './controllers/company.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [StudentController, CompanyController],
  providers: [ProfilesService],
})
export class ProfilesModule {}

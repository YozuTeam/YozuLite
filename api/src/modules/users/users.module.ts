import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { DatabaseModule } from '../../infra/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '@/common/auth/token.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Module({
  imports: [DatabaseModule, JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService, TokenService, JwtAuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}

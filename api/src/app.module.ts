import { Module } from '@nestjs/common';
import { ProfilesModule } from './modules/profiles/profile.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './infra/database/database.module';

@Module({
  imports: [ProfilesModule, UsersModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

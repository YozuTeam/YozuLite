import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('PrismaService connected to the database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

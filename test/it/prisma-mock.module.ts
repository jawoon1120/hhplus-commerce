import { Module } from '@nestjs/common';
import { PrismaMockService } from './prisma-service.mock';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';

@Module({
  providers: [
    {
      provide: PrismaService,
      useClass: PrismaMockService,
    },
  ],
  exports: [PrismaService],
})
export class PrismaMockModule {}

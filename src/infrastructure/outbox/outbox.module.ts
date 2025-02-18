import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  providers: [OutboxService],
  exports: [OutboxService],
  imports: [PrismaModule],
})
export class OutboxModule {}

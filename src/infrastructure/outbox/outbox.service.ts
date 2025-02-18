import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { OutboxStatus } from './outbox-status.enum';

@Injectable()
export class OutboxService {
  constructor(private readonly prisma: PrismaService) {}

  async createOutbox(
    topic: string,
    message: string,
    status: OutboxStatus,
    producer: string,
  ) {
    await this.prisma.outbox.create({
      data: {
        topic,
        message,
        status,
        producer,
      },
    });
  }
}

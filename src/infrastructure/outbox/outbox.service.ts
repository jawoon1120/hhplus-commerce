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
    return await this.prisma.outbox.create({
      data: {
        topic,
        message,
        status,
        producer,
      },
    });
  }

  async updateOutbox(id: number, status: OutboxStatus) {
    return await this.prisma.outbox.update({
      where: { id },
      data: { status },
    });
  }

  async handleDeadMessage(minutes: number) {
    const deadMessages = await this.prisma.outbox.findMany({
      where: {
        status: OutboxStatus.INIT,
        createdAt: {
          lt: new Date(Date.now() - 1000 * 60 * minutes),
        },
      },
    });

    return deadMessages;
  }
}

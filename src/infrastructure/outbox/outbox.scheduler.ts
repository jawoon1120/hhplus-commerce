import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxService } from './outbox.service';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OutboxScheduler {
  constructor(
    private readonly outboxService: OutboxService,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, {
    name: 'OUTBOX_SCHEDULER',
  })
  async handleDeadMessage(): Promise<void> {
    const deadMessages = await this.outboxService.handleDeadMessage(5);
    if (deadMessages.length > 0) {
      deadMessages.forEach((deadMessage) => {
        const message = JSON.parse(deadMessage.message);
        this.kafkaClient.emit(deadMessage.topic, {
          outboxId: deadMessage.id,
          ...message,
        });
      });
    }

    return;
  }
}

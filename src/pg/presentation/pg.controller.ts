import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import { CompletePaymentMessage } from '../../modules/payment/events/complete-payment.message';
import { OutboxStatus } from '../../infrastructure/outbox/outbox-status.enum';

@Controller()
export class PgController {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly outboxService: OutboxService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }

  @MessagePattern('COMPLETE_PAYMENT') // Kafka 토픽 이름
  async handleKafkaMessage(@Payload() message: CompletePaymentMessage) {
    this.outboxService.updateOutbox(message.outboxId, OutboxStatus.PUBLISHED);
    console.log('PG 서버에서 결제 완료 처리');
    return message;
  }
}

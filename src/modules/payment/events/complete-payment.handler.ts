import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CompletePaymentEvent } from './complete-payment.event';
import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CompletePaymentMessage } from './complete-payment.message';
import { OutboxService } from '../../../providers/outbox/outbox.service';
import { OutboxStatus } from '../../../providers/outbox/outbox-status.enum';

// TODO: 이미 마이크로서비스 세팅했는데 kafka 연결관련 OnModuleInit, OnModuleDestroy 로직 필요 X
@EventsHandler(CompletePaymentEvent)
export class CompletePaymentHandler
  implements IEventHandler<CompletePaymentEvent>, OnModuleInit, OnModuleDestroy
{
  constructor(
    private outboxService: OutboxService,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}
  // TODO: 예외처리 부재함 추가이후 테스트도 추가해야함
  async handle(event: CompletePaymentEvent) {
    const { paymentId, finalPrice, orderId } = event;

    const outbox = await this.outboxService.createOutbox(
      'COMPLETE_PAYMENT',
      JSON.stringify({ paymentId, finalPrice, orderId }),
      OutboxStatus.INIT,
      'payment',
    );

    const message = new CompletePaymentMessage(
      paymentId,
      outbox.id,
      finalPrice,
      orderId,
    );
    this.kafkaClient.emit('COMPLETE_PAYMENT', message.toObject());

    return;
  }

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }
}

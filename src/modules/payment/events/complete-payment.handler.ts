import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CompletePaymentEvent } from './complete-payment.event';
import { OutboxService } from '../../../infrastructure/outbox/outbox.service';
import { OutboxStatus } from '../../../infrastructure/outbox/outbox-status.enum';
import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CompletePaymentMessage } from './complete-payment.message';

@EventsHandler(CompletePaymentEvent)
export class CompletePaymentHandler
  implements IEventHandler<CompletePaymentEvent>, OnModuleInit, OnModuleDestroy
{
  constructor(
    private outboxService: OutboxService,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

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

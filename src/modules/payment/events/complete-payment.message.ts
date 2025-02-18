// src/orders/events/OrderCreatedEvent.ts
import { IEvent } from '@nestjs/cqrs';

export class CompletePaymentMessage implements IEvent {
  constructor(
    public readonly paymentId: number,
    public readonly outboxId: number,
    public readonly finalPrice: number,
    public readonly orderId: number,
  ) {}
}

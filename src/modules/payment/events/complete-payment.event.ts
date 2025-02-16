// src/orders/events/OrderCreatedEvent.ts
import { IEvent } from '@nestjs/cqrs';

export class CompletePaymentEvent implements IEvent {
  constructor(public readonly paymentId: number) {}
}

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CompletePaymentEvent } from '../../modules/payment/events/complete-payment.event';
import { PgService } from '../application/pg.service';

@EventsHandler(CompletePaymentEvent)
export class CompletePaymentHandler
  implements IEventHandler<CompletePaymentEvent>
{
  constructor(private pgService: PgService) {}
  handle(event: CompletePaymentEvent) {
    console.log('[CompletePaymentHandler]');
    const { paymentId } = event;
    const isSuccess = this.pgService.requestPayment(paymentId);

    return {
      isSuccess,
    };
  }
}

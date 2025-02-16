import { Module } from '@nestjs/common';
import { PgService } from './application/pg.service';
import { CompletePaymentHandler } from './events/complete-payment.handler';

@Module({
  providers: [PgService, CompletePaymentHandler],
  exports: [CompletePaymentHandler],
})
export class PgModule {}

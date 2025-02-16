import { Module } from '@nestjs/common';
import { PgService } from './application/pg.service';
import { CompletePaymentHandler } from './events/complete-payment.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigService } from '../configs/configs.service';
import { PgController } from './presentation/pg.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          ...AppConfigService.getKafkaClientOptions(),
        },
      },
    ]),
  ],
  providers: [PgService, CompletePaymentHandler],
  exports: [CompletePaymentHandler],
  controllers: [PgController],
})
export class PgModule {}

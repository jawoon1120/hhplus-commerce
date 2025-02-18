import { Module } from '@nestjs/common';
import { PgService } from './application/pg.service';
import { CompletePaymentHandler } from './events/complete-payment.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigService } from '../configs/configs.service';
import { PgController } from './presentation/pg.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'KAFKA_CLIENT',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            ...AppConfigService.getKafkaClientOptions(configService),
          },
        }),
      },
    ]),
  ],
  providers: [PgService, CompletePaymentHandler],
  exports: [CompletePaymentHandler],
  controllers: [PgController],
})
export class PgModule {}

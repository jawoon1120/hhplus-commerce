import { Module } from '@nestjs/common';
import { PgService } from './application/pg.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigService } from '../configs/configs.service';
import { PgController } from './presentation/pg.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OutboxModule } from '../providers/outbox/outbox.module';

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
    OutboxModule,
  ],
  providers: [PgService],
  controllers: [PgController],
})
export class PgModule {}

import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { OutboxScheduler } from './outbox.scheduler';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from '../../configs/configs.service';

@Module({
  providers: [OutboxService, OutboxScheduler],
  exports: [OutboxService],
  imports: [
    PrismaModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'KAFKA_CLIENT',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: AppConfigService.getKafkaClientOptions(configService),
        }),
      },
    ]),
    ScheduleModule.forRoot(),
  ],
})
export class OutboxModule {}

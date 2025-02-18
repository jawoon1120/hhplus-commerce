import { Module } from '@nestjs/common';
import { ConfigModuleOptions, ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as Joi from 'joi';
import { KafkaOptions, Transport } from '@nestjs/microservices';

@Module({})
export class AppConfigService {
  static getEnvFilePath(): string {
    return path.join(__dirname, '.env');
  }

  static getEnvConfigs(): ConfigModuleOptions {
    const dotenvFilePath = this.getEnvFilePath();

    return {
      envFilePath: dotenvFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        RDB_HOST: Joi.string().required(),
        RDB_PORT: Joi.number().required(),
        RDB_PASSWORD: Joi.string().required(),
        RDB_USER: Joi.string().required(),
        RDB_NAME: Joi.string().required(),
      }),
    };
  }

  static getDbconnectionstring(configService: ConfigService): string {
    const connectionString = `mysql://${configService.get<string>('RDB_USER')}:${configService.get<string>('RDB_PASSWORD')}@${configService.get<string>('RDB_HOST')}:${configService.get<string>('RDB_PORT')}/${configService.get<string>('RDB_NAME')}`;

    return connectionString;
  }

  static getKafkaClientOptions(): KafkaOptions['options'] {
    const option = {
      client: {
        clientId: 'nestjs',
        brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
      },
      consumer: {
        groupId: 'nestjs-consumer',
      },
    };
    return option;
  }

  static getKafkaMSAOptions() {
    const kafkaOptions: KafkaOptions = {
      transport: Transport.KAFKA,
      options: this.getKafkaClientOptions(),
    };

    return kafkaOptions;
  }
}

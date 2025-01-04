import { Module } from '@nestjs/common';
import { ConfigModuleOptions, ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as Joi from 'joi';

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
}

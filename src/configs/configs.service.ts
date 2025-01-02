import { Module } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
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
        ORM_ENTITY_SYNC: Joi.boolean().required(),
        ORM_LOGGING: Joi.boolean().required(),
      }),
    };
  }
}

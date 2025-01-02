import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config';
import * as path from 'path';
import * as Joi from 'joi';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

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

  private static getCommonDatabaseConfig(
    configService: ConfigService,
  ): DataSourceOptions {
    const dbConfig: DataSourceOptions = {
      type: 'mysql',
      host: configService.get<string>('RDB_HOST'),
      port: configService.get<number>('RDB_PORT'),
      username: configService.get<string>('RDB_USER'),
      password: configService.get<string>('RDB_PASSWORD'),
      database: configService.get<string>('RDB_NAME'),
      synchronize: false,
      logging: true,
      entities: ['dist/**/entities/*.entity.{ts,js}'],
      migrations: ['dist/migrations/**/*{.ts,.js}'],
      namingStrategy: new SnakeNamingStrategy(),
      migrationsRun: true,
    };

    return dbConfig;
  }

  static getDatabaseConfigs(): TypeOrmModuleAsyncOptions {
    return {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ({
          ...this.getCommonDatabaseConfig(configService),
        }) as TypeOrmModuleAsyncOptions,
      inject: [ConfigService],
    };
  }
}

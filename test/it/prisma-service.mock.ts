import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StartedMySqlContainer } from '@testcontainers/mysql';

@Injectable()
export class MockPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const mysql: StartedMySqlContainer = global.mysql;
    const connectionString = mysql.getConnectionUri();
    console.log(connectionString);
    super({
      datasources: {
        db: {
          url: connectionString,
        },
      },
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

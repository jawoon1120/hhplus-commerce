import { MySqlContainer } from '@testcontainers/mysql';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { runPrismaDbPush } from './util/db-push';
import { seedAll } from './util/seed';
import { RedisContainer } from '@testcontainers/redis';

const init = async () => {
  await Promise.all([initMysql(), initRedis()]);
};
let connectionString: string;
let redisUrl: string;

const initRedis = async () => {
  const redis = await new RedisContainer('redis:7.0')
    .withExposedPorts(6379)
    .start();

  global.redis = redis;
  redisUrl = `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`;

  process.env.REDIS_URL = redisUrl;
};

const initMysql = async () => {
  //TODO: .env.test랑 연결
  const mysql = await new MySqlContainer('mysql:8')
    .withDatabase('hhpluscommerce')
    .withUser('root')
    .withRootPassword('pw')
    .start();

  global.mysql = mysql;
  connectionString = `mysql://root:pw@${mysql.getHost()}:${mysql.getPort()}/${mysql.getDatabase()}`;

  process.env.DATABASE_URL = connectionString;

  new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });

  const prisma = new PrismaClient();

  await runMigrations();
  await runPrismaGenerate();
  await runPrismaDbPush();
  await seedAll(prisma);
};

const runMigrations = async () => {
  try {
    const deployOutput = execSync('npm run test:migrate').toString();
    console.log(deployOutput);
    console.log('Migrations applied successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

const runPrismaGenerate = async () => {
  try {
    const deployOutput = execSync('npm run test:generate').toString();
    console.log(deployOutput);
    console.log('Generate applied successfully.');
  } catch (error) {
    console.error('Error generating prisma:', error);
  }
};

export default init;

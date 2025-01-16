import { MySqlContainer } from '@testcontainers/mysql';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { runPrismaDbPush } from './util/db-push';
import { seedAll } from './util/seed';

const init = async () => {
  await Promise.all([initMysql()]);
};
let connectionString: string;

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

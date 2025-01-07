import { MySqlContainer } from '@testcontainers/mysql';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';

const init = async () => {
  await Promise.all([initMysql()]);
};
let connectionString: string;
const initMysql = async () => {
  //TODO: .env.test랑 연결
  const mysql = await new MySqlContainer('mysql:8')
    .withDatabase('dbname')
    .withUser('root')
    .withRootPassword('pw')
    .start();

  global.mysql = mysql;
  connectionString = `mysql://root:pw@${mysql.getHost()}:${mysql.getPort()}/${mysql.getDatabase()}`;
  process.env.DATABASE_URL = connectionString;

  new PrismaClient();
  await runMigrations();
  await runPrismaGenerate();
  await seedData();
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

const seedData = async () => {
  try {
    const deployOutput = execSync('npm run test:seed').toString();
    console.log(deployOutput);
    console.log('Seeding applied successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

export default init;

import { PrismaClient } from '@prisma/client';

const down = async () => {
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  await global.mysql.stop();
  await global.redis.stop();
};

export default down;

import { PrismaClient } from '@prisma/client';

export const seedBalance = async (prisma: PrismaClient) => {
  const balance1 = await prisma.balance.upsert({
    where: { id: 1 },
    update: {
      amount: 1000,
    },
    create: {
      customerId: 1,
      amount: 1000,
    },
  });
  const balance2 = await prisma.balance.upsert({
    where: { id: 2 },
    update: {
      amount: 1000,
    },
    create: {
      customerId: 1,
      amount: 1000,
    },
  });
  const balance3 = await prisma.balance.upsert({
    where: { id: 3 },
    update: {
      amount: 1000,
    },
    create: {
      customerId: 3,
      amount: 1000,
    },
  });
  console.log(balance1, balance2, balance3);
};

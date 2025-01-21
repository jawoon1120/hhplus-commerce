import { PrismaClient } from '@prisma/client';

export const seedBalance = async (prisma: PrismaClient) => {
  await prisma.balance.createMany({
    data: [
      { id: 1, customerId: 1, amount: 30000 },
      { id: 2, customerId: 2, amount: 30000 },
      { id: 3, customerId: 3, amount: 30000 },
      { id: 4, customerId: 4, amount: 5000 },
    ],
    skipDuplicates: true, // 중복된 id가 있는 경우 건너뜁니다
  });
};

export const truncateBalance = async (prisma: PrismaClient) => {
  await prisma.$executeRaw`TRUNCATE TABLE hhpluscommerce.Balance`;
};

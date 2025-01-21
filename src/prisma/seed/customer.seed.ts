import { PrismaClient } from '@prisma/client';

export const seedCustomer = async (prisma: PrismaClient) => {
  await prisma.customer.createMany({
    data: [
      { id: 1, name: '김항해' },
      { id: 2, name: '박항해' },
      { id: 3, name: '이항해' },
      { id: 4, name: '최항해' },
    ],
    skipDuplicates: true,
  });
};

export const truncateCustomer = async (prisma: PrismaClient) => {
  await prisma.$executeRaw`TRUNCATE TABLE hhpluscommerce.Customer`;
};

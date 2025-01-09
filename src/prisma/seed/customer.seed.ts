import { PrismaClient } from '@prisma/client';

export const seedCustomer = async (prisma: PrismaClient) => {
  const customer1 = await prisma.customer.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '김항해',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: '박항해',
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: '이항해',
    },
  });

  console.log(customer1, customer2, customer3);
};

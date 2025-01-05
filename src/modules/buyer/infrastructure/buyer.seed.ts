import { PrismaClient } from '@prisma/client';

export const seedBuyer = async (prisma: PrismaClient) => {
  const buyer1 = await prisma.buyer.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '김항해',
    },
  });

  const buyer2 = await prisma.buyer.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: '박항해',
    },
  });

  const buyer3 = await prisma.buyer.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: '이항해',
    },
  });

  console.log(buyer1, buyer2, buyer3);
};

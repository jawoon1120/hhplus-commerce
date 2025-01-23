import { PrismaClient } from '@prisma/client';

export const seedOrder = async (prisma: PrismaClient) => {
  await prisma.order.create({
    data: {
      id: 1,
      customerId: 1,
      totalPrice: 3000,
      status: 'CREATED',
      orderDetails: {
        create: [
          {
            productId: 1,
            quantity: 2,
            totalPrice: 2000,
          },
          {
            productId: 2,
            quantity: 2,
            totalPrice: 6000,
          },
        ],
      },
    },
  });
};

export const truncateOrder = async (prisma: PrismaClient) => {
  await prisma.$executeRaw`TRUNCATE TABLE hhpluscommerce.Order`;
};

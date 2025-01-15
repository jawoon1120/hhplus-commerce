import { PrismaClient } from '@prisma/client';

export const seedProduct = async (prisma: PrismaClient) => {
  const products = await prisma.product.createMany({
    data: [
      {
        id: 1,
        name: 'T셔츠',
        price: 1000,
        sellerId: 100,
        totalQuantity: 10,
        stock: 15,
      },
      {
        id: 2,
        name: '바지',
        price: 3000,
        sellerId: 101,
        totalQuantity: 10,
        stock: 10,
      },
      {
        id: 3,
        name: '신발',
        price: 10000,
        sellerId: 102,
        totalQuantity: 10,
        stock: 10,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${products.count} product records`);
};

export const truncateProduct = async (prisma: PrismaClient) => {
  await prisma.$executeRaw`TRUNCATE TABLE hhpluscommerce.Product`;
};

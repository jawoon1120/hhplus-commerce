import { PrismaClient } from '@prisma/client';

export const seedProduct = async (prisma: PrismaClient) => {
  const shirt = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'T셔츠',
      price: 10000,
      sellerId: 100,
      totalQuantity: 10,
      stock: 10,
    },
  });
  const pants = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: '바지',
      price: 30000,
      sellerId: 101,
      totalQuantity: 10,
      stock: 10,
    },
  });
  const shoes = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: '신발',
      price: 100000,
      sellerId: 102,
      totalQuantity: 10,
      stock: 10,
    },
  });
  console.log(shirt, pants, shoes);
};

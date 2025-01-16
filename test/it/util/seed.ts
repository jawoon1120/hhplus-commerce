import { PrismaClient } from '@prisma/client';
import { seedCoupon } from '../../../src/prisma/seed/coupon.seed';
import { seedCustomer } from '../../../src/prisma/seed/customer.seed';
import { seedBalance } from '../../../src/prisma/seed/balance.seed';
import { seedProduct } from '../../../src/prisma/seed/product.seed';

export const seedAll = async (prisma: PrismaClient) => {
  await seedCustomer(prisma);
  await seedBalance(prisma);
  await seedCoupon(prisma);
  await seedProduct(prisma);
};

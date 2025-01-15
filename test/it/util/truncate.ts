import { PrismaClient } from '@prisma/client';
import { truncateProduct } from '../../../src/prisma/seed/product.seed';
import { truncateCoupon } from '../../../src/prisma/seed/coupon.seed';
import { truncateBalance } from '../../../src/prisma/seed/balance.seed';
import { truncateCustomer } from '../../../src/prisma/seed/customer.seed';

export const truncateAll = async (prisma: PrismaClient) => {
  await truncateBalance(prisma);
  await truncateCustomer(prisma);
  await truncateCoupon(prisma);
  await truncateProduct(prisma);
};

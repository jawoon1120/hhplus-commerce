import { PrismaClient } from '@prisma/client';
import { seedCoupon } from './seed/coupon.seed';
import { seedProduct } from './seed/product.seed';
import { seedCustomer } from './seed/customer.seed';
import { seedBalance } from './seed/balance.seed';
import { seedOrder } from './seed/order.seed';
const prisma = new PrismaClient();
async function main() {
  await seedCustomer(prisma);
  await seedCoupon(prisma);
  await seedProduct(prisma);
  await seedBalance(prisma);
  await seedOrder(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

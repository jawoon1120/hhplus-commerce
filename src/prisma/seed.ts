import { PrismaClient } from '@prisma/client';
import { seedBuyer } from '../modules/buyer/infrastructure/buyer.seed';
import { seedCoupon } from '../modules/coupon/infrastructure/coupon.seed';
import { seedProduct } from '../modules/product/infrastructure/product.seed';
const prisma = new PrismaClient();
async function main() {
  await seedBuyer(prisma);
  await seedCoupon(prisma);
  await seedProduct(prisma);
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

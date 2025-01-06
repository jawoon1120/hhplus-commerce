import { PrismaClient } from '@prisma/client';

export const seedCoupon = async (prisma: PrismaClient) => {
  const after30Days = new Date(new Date().getTime() + 60 * 60 * 24 * 30);

  const tenPercentDiscountCoupon = await prisma.coupon.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: '10% 할인 쿠폰',
      type: 'PERCENT',
      startDate: new Date(),
      endDate: after30Days,
      discountAmount: 10,
      totalQuantity: 10,
      remainingQuantity: 10,
    },
  });

  const tenThousandWonDiscountCoupon = await prisma.coupon.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: '10000원 할인 쿠폰',
      type: 'AMOUNT',
      startDate: new Date(),
      endDate: after30Days,
      discountAmount: 10000,
      totalQuantity: 10,
      remainingQuantity: 10,
    },
  });

  console.log(tenPercentDiscountCoupon, tenThousandWonDiscountCoupon);
};

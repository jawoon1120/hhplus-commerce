import { Test, TestingModule } from '@nestjs/testing';
import { CouponService } from '../../../src/modules/coupon/application/coupon.service';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { PrismaMockService } from '../prisma-service.mock';
import { ClsModule } from 'nestjs-cls';
import { clsModuleMockOption } from '../cls-module.mock';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('CouponService - issueCoupon', () => {
  let couponService: CouponService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useClass(PrismaMockService)
      .overrideModule(ClsModule)
      .useModule(ClsModule.forRoot(clsModuleMockOption))
      .overrideModule(RedisModule)
      .useModule(
        RedisModule.forRootAsync({
          useFactory: () => ({
            type: 'single',
            url: process.env.REDIS_URL,
          }),
        }),
      )
      .compile();

    couponService = module.get<CouponService>(CouponService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should issue a coupon successfully', async () => {
    // given
    const customerId = 1;
    const couponId = 1;
    const couponCount = 5;
    // when
    const requests = Array.from({ length: couponCount }, () =>
      couponService.issueCoupon(customerId, couponId),
    );
    const results = await Promise.allSettled(requests);

    const successfulCoupons = results.filter(
      (result) => result.status === 'fulfilled',
    );
    expect(successfulCoupons.length).toBe(couponCount);

    const issuedCoupons = await prismaService.issuedCoupon.findMany({
      where: { couponId: couponId, customerId: customerId },
    });

    expect(issuedCoupons.length).toBe(couponCount);
  });
});

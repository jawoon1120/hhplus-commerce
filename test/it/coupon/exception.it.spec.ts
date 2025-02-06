import { Test, TestingModule } from '@nestjs/testing';
import { CouponService } from '../../../src/modules/coupon/application/coupon.service';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { PrismaMockService } from '../prisma-service.mock';
import { ClsModule } from 'nestjs-cls';
import { clsModuleMockOption } from '../cls-module.mock';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BadRequestException } from '@nestjs/common';

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

  describe('쿠폰 발급 대기열 예외처리', () => {
    it('쿠폰 발급 시작일이 되지 않은 경우 BadRequestException을 던진다', async () => {
      // given
      const customerId = 1;
      const futureStartDateCouponId = 3;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // 내일 날짜로 설정

      await prismaService.coupon.create({
        data: {
          id: futureStartDateCouponId,
          name: '미래 시작일 쿠폰',
          type: 'AMOUNT',
          startDate: futureDate,
          endDate: new Date(futureDate.getTime() + 24 * 60 * 60 * 1000), // 하루 뒤
          discountAmount: 1000,
          totalQuantity: 100,
          remainingQuantity: 100,
        },
      });

      // when & then
      await expect(
        couponService.registerIssueCouponWaitingList(
          customerId,
          futureStartDateCouponId,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('쿠폰 발급 대기열 처리', () => {
    it('쿠폰 발급 대기열에 성공적으로 등록된다', async () => {
      // given
      const customerId = 1;
      const availableCouponId = 4;
      const currentDate = new Date();

      await prismaService.coupon.create({
        data: {
          id: availableCouponId,
          name: '즉시 사용 가능 쿠폰',
          type: 'AMOUNT',
          startDate: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000), // 어제 날짜
          endDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // 내일 날짜
          discountAmount: 1000,
          totalQuantity: 100,
          remainingQuantity: 100,
        },
      });

      // when
      await expect(
        couponService.registerIssueCouponWaitingList(
          customerId,
          availableCouponId,
        ),
      ).resolves.not.toThrow();

      // then
      const waitingList = await couponService[
        'couponRepository'
      ].getWaitingListByTimeOrder(availableCouponId, 1);
      expect(waitingList).toHaveLength(1);
      expect(waitingList[0]).toBe(customerId);

      const couponInfo =
        await couponService['couponRepository'].getCouponInfo(
          availableCouponId,
        );
      expect(couponInfo).toBeDefined();
      expect(couponInfo.totalQuantity).toBe(100);
    });
  });
});

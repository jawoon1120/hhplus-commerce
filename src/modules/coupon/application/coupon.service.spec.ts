import { Test, TestingModule } from '@nestjs/testing';
import { CouponService } from './coupon.service';
import { ICouponRepository } from './coupon-repository.interface';
import { IIssuedCouponRepository } from './issued-coupon-repository.interface';
import { NotFoundException } from '@nestjs/common';
import { Coupon, CouponType } from '../domain/coupon.domain';
import {
  IssuedCoupon,
  IssuedCouponStatus,
} from '../domain/issued-coupon.domain';
import { ClsModule } from 'nestjs-cls';
import { TransactionHost } from '@nestjs-cls/transactional';

describe('CouponService', () => {
  let service: CouponService;
  let couponRepository: jest.Mocked<ICouponRepository>;
  let issuedCouponRepository: jest.Mocked<IIssuedCouponRepository>;

  beforeEach(async () => {
    const mockTxHost = {
      tx: {
        payment: {
          create: jest.fn(),
          update: jest.fn(),
        },
      },
      withTransaction: jest.fn((callback) => callback()), // 이 부분 추가
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModule.forRoot({
          global: true,
          middleware: { mount: true },
        }),
      ],
      providers: [
        {
          provide: TransactionHost,
          useValue: mockTxHost,
        },
        CouponService,
        {
          provide: ICouponRepository,
          useValue: {
            getCoupons: jest.fn(),
            getCouponByIdWithLock: jest.fn(),
            decreaseCouponQuantityOnlyOne: jest.fn(),
          },
        },
        {
          provide: IIssuedCouponRepository,
          useValue: {
            getOwnedCoupons: jest.fn(),
            getIssuedCouponByIdWithCoupon: jest.fn(),
            issueCoupon: jest.fn(),
            updateIssuedCoupon: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CouponService>(CouponService);
    couponRepository = module.get(ICouponRepository);
    issuedCouponRepository = module.get(IIssuedCouponRepository);
  });

  describe('getCoupons', () => {
    it('모든 쿠폰을 조회한다', async () => {
      // given
      const mockCoupons = [
        new Coupon({
          id: 1,
          name: '10% 할인 쿠폰',
          type: CouponType.PERCENT,
          discountAmount: 10,
          remainingQuantity: 100,
        }),
      ];
      couponRepository.getCoupons.mockResolvedValue(mockCoupons);

      // when
      const result = await service.getCoupons();

      // then
      expect(result).toEqual(mockCoupons);
      expect(couponRepository.getCoupons).toHaveBeenCalled();
    });
  });

  describe('getOwnedCoupons', () => {
    it('사용자가 보유한 쿠폰이 있을 때 쿠폰 목록을 반환한다', async () => {
      // given
      const customerId = 1;
      const mockIssuedCoupons = [
        new IssuedCoupon({
          id: 1,
          customerId,
          couponId: 1,
          status: IssuedCouponStatus.UNUSED,
        }),
      ];
      issuedCouponRepository.getOwnedCoupons.mockResolvedValue(
        mockIssuedCoupons,
      );

      // when
      const result = await service.getOwnedCoupons(customerId);

      // then
      expect(result).toEqual(mockIssuedCoupons);
      expect(issuedCouponRepository.getOwnedCoupons).toHaveBeenCalledWith(
        customerId,
      );
    });

    it('사용자가 보유한 쿠폰이 없을 때 NotFoundException을 던진다', async () => {
      // given
      const customerId = 1;
      issuedCouponRepository.getOwnedCoupons.mockResolvedValue([]);

      // when & then
      await expect(service.getOwnedCoupons(customerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(issuedCouponRepository.getOwnedCoupons).toHaveBeenCalledWith(
        customerId,
      );
    });
  });
});

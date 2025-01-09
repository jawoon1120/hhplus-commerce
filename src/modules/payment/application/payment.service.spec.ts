import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { IPaymentRepository } from './payment-repository.interface';
import { CouponService } from '../../coupon/application/coupon.service';
import { Payment, PaymentStatus } from '../domain/payment.domain';
import { Order } from '../../order/domain/order.domain';
import { IssuedCoupon } from '../../coupon/domain/issued-coupon.domain';
import { Coupon, CouponType } from '../../coupon/domain/coupon.domain';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: jest.Mocked<IPaymentRepository>;
  let couponService: jest.Mocked<CouponService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: IPaymentRepository,
          useValue: {
            createPayment: jest.fn(),
            updatePaymentStatus: jest.fn(),
          },
        },
        {
          provide: CouponService,
          useValue: {
            useIssuedCoupon: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get(IPaymentRepository);
    couponService = module.get(CouponService);
  });

  describe('createPayment', () => {
    it('쿠폰 없이 결제를 생성한다', async () => {
      // given
      const mockOrder = new Order({
        id: 1,
        customerId: 1,
        totalPrice: 10000,
      });

      const mockPayment = new Payment({
        id: 1,
        orderId: mockOrder.id,
        status: PaymentStatus.PAID,
        originPrice: mockOrder.totalPrice,
        finalPrice: mockOrder.totalPrice,
      });

      paymentRepository.createPayment.mockResolvedValue(mockPayment);

      // when
      const result = await service.createPayment(
        mockOrder,
        PaymentStatus.PAID,
        null,
      );

      // then
      expect(result).toEqual(mockPayment);
      expect(paymentRepository.createPayment).toHaveBeenCalled();
      expect(couponService.useIssuedCoupon).not.toHaveBeenCalled();
    });

    it('쿠폰을 적용하여 결제를 생성한다', async () => {
      // given
      const mockOrder = new Order({
        id: 1,
        customerId: 1,
        totalPrice: 10000,
      });

      const mockCoupon = new Coupon({
        id: 1,
        type: CouponType.AMOUNT,
        discountAmount: 1000,
      });

      const mockIssuedCoupon = new IssuedCoupon({
        id: 1,
        couponId: mockCoupon.id,
        customerId: 1,
        coupon: mockCoupon,
      });

      const mockPayment = new Payment({
        id: 1,
        orderId: mockOrder.id,
        status: PaymentStatus.PAID,
        originPrice: mockOrder.totalPrice,
        issuedCouponId: mockIssuedCoupon.id,
        discountedPrice: mockCoupon.discountAmount,
        finalPrice: mockOrder.totalPrice - mockCoupon.discountAmount,
      });

      paymentRepository.createPayment.mockResolvedValue(mockPayment);

      // when
      const result = await service.createPayment(
        mockOrder,
        PaymentStatus.PAID,
        mockIssuedCoupon,
      );

      // then
      expect(result).toEqual(mockPayment);
      expect(paymentRepository.createPayment).toHaveBeenCalled();
      expect(couponService.useIssuedCoupon).toHaveBeenCalledWith(
        mockIssuedCoupon,
      );
    });
  });

  describe('updatePaymentStatus', () => {
    it('결제 상태를 업데이트한다', async () => {
      // given
      const paymentId = 1;
      const newStatus = PaymentStatus.COMPLETED;
      const mockPayment = new Payment({
        id: paymentId,
        status: newStatus,
      });

      paymentRepository.updatePaymentStatus.mockResolvedValue(mockPayment);

      // when
      const result = await service.updatePaymentStatus(paymentId, newStatus);

      // then
      expect(result).toEqual(mockPayment);
      expect(paymentRepository.updatePaymentStatus).toHaveBeenCalledWith(
        paymentId,
        newStatus,
      );
    });
  });
});

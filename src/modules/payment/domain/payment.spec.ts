import { Payment, PaymentStatus } from './payment.domain';
import { IssuedCoupon } from '../../coupon/domain/issued-coupon.domain';
import { Coupon } from '../../coupon/domain/coupon.domain';
import { BadRequestException } from '../../../common/custom-exception/bad-request.exception';

describe('Payment', () => {
  describe('create', () => {
    it('payment 객체를 생성할 수 있다', () => {
      // given
      const paymentData = {
        id: 1,
        orderId: 1,
        status: PaymentStatus.PAID,
        originPrice: 10000,
        discountedPrice: 0,
        finalPrice: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // when
      const payment = Payment.create(paymentData);

      // then
      expect(payment).toBeInstanceOf(Payment);
      expect(payment.id).toBe(paymentData.id);
      expect(payment.orderId).toBe(paymentData.orderId);
      expect(payment.status).toBe(paymentData.status);
      expect(payment.originPrice).toBe(paymentData.originPrice);
    });
  });

  describe('applyDiscount', () => {
    it('쿠폰 할인을 적용할 수 있다', () => {
      // given
      const payment = Payment.create({
        id: 1,
        orderId: 1,
        status: PaymentStatus.PAID,
        originPrice: 10000,
        discountedPrice: 0,
        finalPrice: 10000,
      });

      const issuedCoupon = {
        id: 1,
        coupon: {
          id: 1,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          calculateDiscountPrice: (price: number) => 1000,
        },
      } as IssuedCoupon;

      // when
      payment.applyDiscount(
        issuedCoupon.id,
        issuedCoupon.coupon.calculateDiscountPrice(10000),
      );

      // then
      expect(payment.issuedCouponId).toBe(issuedCoupon.id);
      expect(payment.discountedPrice).toBe(1000);
      expect(payment.finalPrice).toBe(9000);
    });

    it('할인 금액이 원래 가격보다 크면 에러를 던진다', () => {
      // given
      const payment = Payment.create({
        id: 1,
        orderId: 1,
        status: PaymentStatus.PAID,
        originPrice: 10000,
        discountedPrice: 0,
        finalPrice: 10000,
      });

      const coupon = {
        id: 1,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        calculateDiscountPrice: (price: number) => 20000,
      } as Coupon;

      const issuedCoupon = {
        id: 1,
        coupon,
      } as IssuedCoupon;

      // when & then
      expect(() =>
        payment.applyDiscount(
          issuedCoupon.id,
          issuedCoupon.coupon.calculateDiscountPrice(10000),
        ),
      ).toThrow(BadRequestException);
    });
  });
});

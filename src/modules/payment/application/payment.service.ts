import { Inject, Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from '../domain/payment.domain';

import { IPaymentRepository } from './payment-repository.interface';
import { IssuedCoupon } from '../../coupon/domain/issued-coupon.domain';

import { CouponService } from '../../coupon/application/coupon.service';
import { Order } from '../../order/domain/order.domain';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    private readonly couponService: CouponService,
  ) {}

  async createPayment(
    order: Order,
    status: PaymentStatus,
    issuedCoupon: IssuedCoupon | null,
  ): Promise<Payment> {
    const payment = Payment.create({
      orderId: order.id,
      status: status,
      originPrice: order.totalPrice,
    });

    if (issuedCoupon) {
      payment.applyDiscount(issuedCoupon);
      await this.couponService.useIssuedCoupon(issuedCoupon);
    }

    return await this.paymentRepository.createPayment(payment);
  }

  async updatePaymentStatus(paymentId: number, status: PaymentStatus) {
    return await this.paymentRepository.updatePaymentStatus(paymentId, status);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from '../domain/payment.domain';

import { IPaymentRepository } from '../application/payment-repository.interface';
import { IssuedCoupon } from '../../coupon/domain/issued-coupon.domain';
import { Order } from '../../order/domain/order.domain';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async createPayment(
    order: Order,
    status: PaymentStatus,
    issuedCoupon?: IssuedCoupon,
  ): Promise<Payment> {
    const payment = Payment.create({
      orderId: order.id,
      status: status,
      originPrice: order.totalPrice,
      finalPrice: order.totalPrice,
    });

    if (issuedCoupon) {
      const discountPrice = issuedCoupon?.coupon.calculateDiscountPrice(
        order.totalPrice,
      );
      payment.applyDiscount(issuedCoupon.id, discountPrice);
    }

    return await this.paymentRepository.createPayment(payment);
  }

  async updatePaymentStatus(paymentId: number, status: PaymentStatus) {
    return await this.paymentRepository.updatePaymentStatus(paymentId, status);
  }
}

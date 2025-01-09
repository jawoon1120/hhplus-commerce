import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponService } from '../../coupon/application/coupon.service';
import { CustomerService } from '../../customer/application/customer.service';
import { OrderService } from '../../order/application/order.service';
import { BalanceService } from '../../balance/application/balance.service';
import { Transactional } from '@nestjs-cls/transactional';
import { PaymentService } from './payment.service';
import { PaymentStatus } from '../domain/payment.domain';
import { PgService } from '../../../pg/pg.service';
import { OrderStatus } from '../../order/domain/order.domain';

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly couponService: CouponService,
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly balanceService: BalanceService,
    private readonly paymentService: PaymentService,
    private readonly pgService: PgService,
  ) {}

  // #1 예외 : order 가격보다 할인 가격이 더 클 때
  // #2 예외 : 쿠폰 사용 불가
  // #3 예외 : order 주문자랑 customer 다름
  // #4 예외 : 잔액 부족
  // #5 예외 : 결제 실패
  // #6 정상 흐름
  @Transactional()
  async makePayment(
    orderId: number,
    customerId: number,
    issuedCouponId: number | null,
  ) {
    const customer = await this.customerService.getCustomerById(customerId);
    const order = await this.orderService.getOrderById(orderId);
    if (customer.id !== order.customerId) {
      throw new BadRequestException('Customer and order do not match');
    }

    const issuedCoupon =
      await this.couponService.getIssuedCouponByIdWithCoupon(issuedCouponId);
    try {
      await this.balanceService.withdrawBalance(customerId, order.totalPrice);
    } catch {
      const payment = await this.paymentService.createPayment(
        order,
        PaymentStatus.CANCELED,
        issuedCoupon,
      );
      await this.orderService.updateOrderStatus(order, OrderStatus.CANCELED);
      return payment;
    }

    const payment = await this.paymentService.createPayment(
      order,
      PaymentStatus.PAID,
      issuedCoupon,
    );

    const isSuccess = await this.pgService.requestPayment(payment.id);
    await this.paymentService.updatePaymentStatus(
      payment.id,
      isSuccess ? PaymentStatus.COMPLETED : PaymentStatus.CANCELED,
    );
    await this.orderService.updateOrderStatus(order, OrderStatus.PAID);
    return payment;
  }
}

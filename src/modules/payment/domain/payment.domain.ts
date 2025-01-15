import { BadRequestException } from '../../../common/custom-exception/bad-request.exception';

export enum PaymentStatus {
  PAID = 'PAID', //만들 때 이거
  CANCELED = 'CANCELED', //TODO
  COMPLETED = 'COMPLETED', //완료
}

export class Payment {
  id: number;
  orderId: number;
  issuedCouponId: number;
  status: PaymentStatus;
  originPrice: number;
  discountedPrice: number;
  finalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(payment: Partial<Payment>) {
    if (!payment) {
      return null;
    }
    return Object.assign(this, payment);
  }

  static create(payment: Partial<Payment>) {
    return new Payment(payment);
  }

  applyDiscount(issuedCouponId: number, discountPrice: number) {
    this.issuedCouponId = issuedCouponId;
    if (discountPrice > this.originPrice) {
      throw new BadRequestException(
        'Discount price is greater than origin price',
      );
    }
    this.discountedPrice = discountPrice;
    this.finalPrice = this.originPrice - this.discountedPrice;
  }
}

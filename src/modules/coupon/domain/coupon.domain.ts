export enum CouponType {
  PERCENT = 'PERCENT',
  AMOUNT = 'AMOUNT',
}

export class Coupon {
  id: number;
  name: string;
  type: CouponType;
  discountAmount: number;
  startDate: Date;
  endDate: Date;
  totalQuantity: number;
  remainingQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(coupon: Partial<Coupon>) {
    if (!coupon) {
      return null;
    }
    return Object.assign(this, coupon);
  }

  static create(coupon: Partial<Coupon>) {
    return new Coupon(coupon);
  }

  calculateDiscountPrice(totalPrice: number): number {
    let discountPrice = 0;
    if (this.type === CouponType.PERCENT) {
      discountPrice = (totalPrice * this.discountAmount) / 100;
    } else {
      discountPrice = this.discountAmount;
    }
    return discountPrice;
  }
}

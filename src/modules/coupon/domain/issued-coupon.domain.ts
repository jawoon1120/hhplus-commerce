import { Coupon } from './coupon.domain';

export enum IssuedCouponStatus {
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  UNUSED = 'UNUSED',
}

export class IssuedCoupon {
  id: number;
  customerId: number;
  couponId: number;
  expiredDate: Date;
  status: IssuedCouponStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  coupon: Coupon;

  constructor(issuedCoupon: Partial<IssuedCoupon>) {
    if (!issuedCoupon) {
      return null;
    }
    return Object.assign(this, issuedCoupon);
  }

  static create(issuedCoupon: Partial<IssuedCoupon>) {
    return new IssuedCoupon(issuedCoupon);
  }
}

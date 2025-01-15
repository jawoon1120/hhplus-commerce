import { BadRequestException } from '../../../common/custom-exception/bad-request.exception';
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

  useIssueCoupon() {
    if (this.status === IssuedCouponStatus.USED) {
      throw new BadRequestException('Coupon is already used');
    } else if (this.status === IssuedCouponStatus.EXPIRED) {
      throw new BadRequestException('Coupon is expired');
    }
    this.status = IssuedCouponStatus.USED;
    this.expiredDate = new Date();
  }
}

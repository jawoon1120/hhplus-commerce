import { IssuedCoupon } from '../domain/issued-coupon.domain';

export interface IIssuedCouponRepository {
  getOwnedCoupons(customerId: number): Promise<IssuedCoupon[]>;
  issueCoupon(issuedCoupon: IssuedCoupon): Promise<IssuedCoupon>;
  getIssuedCouponByIdWithCoupon(issuedCouponId: number): Promise<IssuedCoupon>;
  updateIssuedCoupon(issuedCoupon: IssuedCoupon): Promise<IssuedCoupon>;
}

export const IIssuedCouponRepository = Symbol('IIssuedCouponRepository');

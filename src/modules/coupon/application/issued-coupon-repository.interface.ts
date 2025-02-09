import { IssuedCoupon } from '../domain/issued-coupon.domain';

export interface IIssuedCouponRepository {
  getOwnedCoupons(customerId: number): Promise<IssuedCoupon[]>;
  issueCoupon(issuedCoupon: IssuedCoupon): Promise<IssuedCoupon>;
  getIssuedCouponByIdWithCoupon(issuedCouponId: number): Promise<IssuedCoupon>;
  updateIssuedCoupon(issuedCoupon: IssuedCoupon): Promise<IssuedCoupon>;
  applyIssuedCoupons(issuedCouponList: IssuedCoupon[]): Promise<void>;
  saveIssuedCouponHistory(
    couponId: number,
    issuedCouponCustomerIds: number[],
  ): Promise<void>;
  checkCouponHistory(customerId: number, couponId: number): Promise<boolean>;
  getIssuedCouponCount(couponId: number): Promise<number>;
  delCouponHistory(couponId: number): Promise<void>;
}

export const IIssuedCouponRepository = Symbol('IIssuedCouponRepository');

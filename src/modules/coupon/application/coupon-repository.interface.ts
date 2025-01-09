import { Coupon } from '../domain/coupon.domain';

export interface ICouponRepository {
  getCoupons(): Promise<Coupon[]>;
  getCouponByIdWithLock(couponId: number): Promise<Coupon>;
  decreaseCouponQuantityOnlyOne(couponId: number): Promise<void>;
}

export const ICouponRepository = Symbol('ICouponRepository');

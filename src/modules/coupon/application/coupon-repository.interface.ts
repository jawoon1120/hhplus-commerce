import { Coupon } from '../domain/coupon.domain';
import { ICouponInfo } from '../domain/interface/coupon-info.interface';

export interface ICouponRepository {
  getCoupons(): Promise<Coupon[]>;
  getCouponById(couponId: number): Promise<Coupon>;
  decreaseCouponQuantity(couponId: number, quantity: number): Promise<void>;
  getCouponInfo(couponId: number): Promise<ICouponInfo>;
  setCouponInfo(couponId: number, couponInfo: ICouponInfo): Promise<void>;
  waitingCouponIssue(couponId: number, customerId: number): Promise<void>;
  getWaitingListByTimeOrder(couponId: number, limit: number): Promise<number[]>;
  removeCustomerFromWaitingList(couponId: number, limit: number): Promise<void>;
  delCouponInfo(couponId: number): Promise<void>;
  delCouponWaitingList(couponId: number): Promise<void>;
}

export const ICouponRepository = Symbol('ICouponRepository');

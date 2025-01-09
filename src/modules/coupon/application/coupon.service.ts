import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coupon } from '../domain/coupon.domain';
import { ICouponRepository } from './coupon-repository.interface';
import { IIssuedCouponRepository } from './issued-coupon-repository.interface';
import {
  IssuedCoupon,
  IssuedCouponStatus,
} from '../domain/issued-coupon.domain';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class CouponService {
  constructor(
    @Inject(ICouponRepository)
    private readonly couponRepository: ICouponRepository,
    @Inject(IIssuedCouponRepository)
    private readonly issuedCouponRepository: IIssuedCouponRepository,
  ) {}

  async getCoupons(): Promise<Coupon[]> {
    return await this.couponRepository.getCoupons();
  }

  async getOwnedCoupons(customerId: number): Promise<IssuedCoupon[]> {
    const isseudCoupon =
      await this.issuedCouponRepository.getOwnedCoupons(customerId);

    if (isseudCoupon.length === 0) {
      throw new NotFoundException('No owned coupons found');
    }

    return isseudCoupon;
  }

  async getIssuedCouponByIdWithCoupon(
    issuedCouponId: number,
  ): Promise<IssuedCoupon> {
    const issuedCounpon =
      await this.issuedCouponRepository.getIssuedCouponByIdWithCoupon(
        issuedCouponId,
      );

    return issuedCounpon;
  }

  async useIssuedCoupon(issuedCoupon: IssuedCoupon) {
    issuedCoupon.useIssueCoupon();
    return await this.issuedCouponRepository.updateIssuedCoupon(issuedCoupon);
  }

  @Transactional()
  async issueCoupon(
    customerId: number,
    couponId: number,
  ): Promise<IssuedCoupon> {
    const coupon = await this.couponRepository.getCouponByIdWithLock(couponId);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    if (coupon.remainingQuantity <= 0) {
      throw new BadRequestException('Coupon is sold out');
    }

    const issuedCoupon = IssuedCoupon.create({
      customerId,
      couponId: coupon.id,
      expiredDate: coupon.endDate,
      status: IssuedCouponStatus.UNUSED,
    });

    await this.couponRepository.decreaseCouponQuantityOnlyOne(couponId);

    return await this.issuedCouponRepository.issueCoupon(issuedCoupon);
  }
}

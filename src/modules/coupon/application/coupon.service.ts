import { Inject, Injectable } from '@nestjs/common';
import { Coupon } from '../domain/coupon.domain';
import { ICouponRepository } from './coupon-repository.interface';
import { IIssuedCouponRepository } from './issued-coupon-repository.interface';
import {
  IssuedCoupon,
  IssuedCouponStatus,
} from '../domain/issued-coupon.domain';
import { NotFoundException } from '../../../common/custom-exception/not-found.exception';
import { BadRequestException } from '../../../common/custom-exception/bad-request.exception';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CouponService {
  constructor(
    @Inject(ICouponRepository)
    private readonly couponRepository: ICouponRepository,
    @Inject(IIssuedCouponRepository)
    private readonly issuedCouponRepository: IIssuedCouponRepository,
    private readonly schedulerRegistry: SchedulerRegistry,
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

  async registerIssueCouponWaitingList(
    customerId: number,
    couponId: number,
  ): Promise<void> {
    let couponInfo = await this.couponRepository.getCouponInfo(couponId);
    if (!couponInfo) {
      const newCoupon = await this.couponRepository.getCouponById(couponId);
      couponInfo = {
        startDate: newCoupon.startDate,
        totalQuantity: newCoupon.totalQuantity,
        endDate: newCoupon.endDate,
      };
      await this.couponRepository.setCouponInfo(couponId, couponInfo);
      const cronJob = this.generateIssueCouponCronJob(couponId);
      this.schedulerRegistry.addCronJob(`ISSUE_COUPON_${couponId}`, cronJob);
      cronJob.start();
    }

    if (couponInfo.startDate > new Date()) {
      throw new BadRequestException('Coupon is not available');
    }

    await this.couponRepository.waitingCouponIssue(couponId, customerId);
    return;
  }

  generateIssueCouponCronJob(couponId: number): CronJob {
    return new CronJob(CronExpression.EVERY_MINUTE, () => {
      this.issueCouponThroughWaitingList(couponId);
    });
  }

  ): Promise<IssuedCoupon> {
    const lockKey = `coupon:issue:${couponId}`;
    return await this.redisService.withSpinLock(lockKey, async () => {
      const coupon =
        await this.couponRepository.getCouponByIdWithLock(couponId);
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
    });
  }
}

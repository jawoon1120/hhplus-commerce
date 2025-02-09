import { Inject, Injectable } from '@nestjs/common';
import { Coupon } from '../domain/coupon.domain';
import { ICouponRepository } from './coupon-repository.interface';
import { IIssuedCouponRepository } from './issued-coupon-repository.interface';
import {
  IssuedCoupon,
  IssuedCouponStatus,
} from '../domain/issued-coupon.domain';
import { Transactional } from '@nestjs-cls/transactional';
import { NotFoundException } from '../../../common/custom-exception/not-found.exception';
import { BadRequestException } from '../../../common/custom-exception/bad-request.exception';
import { RedisService } from '../../../infrastructure/redis/redis.service';

@Injectable()
export class CouponService {
  constructor(
    @Inject(ICouponRepository)
    private readonly couponRepository: ICouponRepository,
    @Inject(IIssuedCouponRepository)
    private readonly issuedCouponRepository: IIssuedCouponRepository,
    private readonly redisService: RedisService, // RedisService 주입
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

<<<<<<< Updated upstream
      const issuedCoupon = IssuedCoupon.create({
=======
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

  // TODO: getWaitingListByTimeOrder 할때 제거와 조회 로직을 같이 넣자
  // TODO: 동시성 고려 & 통합테스트 코드 작성
  // TODO: sismember 로직 빼자
  async issueCouponThroughWaitingList(couponId: number) {
    const coupon = await this.couponRepository.getCouponById(couponId);

    const nextIssuedCouponCount = coupon.remainingQuantity;
    if (nextIssuedCouponCount <= 0) {
      this.schedulerRegistry.getCronJob(`ISSUE_COUPON_${couponId}`).stop();
      await this.couponRepository.delCouponInfo(couponId);
      await this.couponRepository.delCouponWaitingList(couponId);
      await this.issuedCouponRepository.delCouponHistory(couponId);
    }

    const waitingCustomerIdList =
      await this.couponRepository.getWaitingListByTimeOrder(
        couponId,
        nextIssuedCouponCount,
      );
    if (waitingCustomerIdList.length <= 0) return;

    await this.couponRepository.removeCustomerFromWaitingList(
      couponId,
      nextIssuedCouponCount,
    );

    const issuedCouponList = waitingCustomerIdList.map((customerId) => {
      return new IssuedCoupon({
>>>>>>> Stashed changes
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

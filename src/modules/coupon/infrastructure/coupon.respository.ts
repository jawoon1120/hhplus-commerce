import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ICouponRepository } from '../application/coupon-repository.interface';
import { Injectable } from '@nestjs/common';
import { Coupon as CouponEntity } from '@prisma/client';
import { Coupon } from '../domain/coupon.domain';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CouponDataMapper } from './coupon.data-mapper';
import { ICouponInfo } from '../domain/interface/coupon-info.interface';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

// TODO: redis, rdb 분리이후 repository에서 잘 말아서 쓰는 리팩토링!
@Injectable()
export class CouponRepository implements ICouponRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly couponDataMapper: CouponDataMapper,
    @InjectRedis() private readonly client: Redis,
  ) {}

  async getCouponById(couponId: number): Promise<Coupon> {
    const couponEntities = await this.txHost.tx.$queryRaw<
      CouponEntity[]
    >`SELECT * FROM Coupon WHERE id = ${couponId}`;

    const couponEntity = couponEntities[0];
    return this.couponDataMapper.toDomain(couponEntity);
  }

  async decreaseCouponQuantity(
    couponId: number,
    quantity: number,
  ): Promise<void> {
    await this.txHost.tx.coupon.update({
      where: { id: couponId },
      data: { remainingQuantity: { decrement: quantity } },
    });
  }

  async getCoupons(): Promise<Coupon[]> {
    const couponEnties: CouponEntity[] = await this.prisma.coupon.findMany();
    return couponEnties.map((couponEntity) =>
      this.couponDataMapper.toDomain(couponEntity),
    );
  }

  async setCouponInfo(
    couponId: number,
    couponInfo: ICouponInfo,
  ): Promise<void> {
    await this.client.set(
      `coupon-info:${couponId}`,
      JSON.stringify(couponInfo),
    );
  }

  async getCouponInfo(couponId: number): Promise<ICouponInfo> {
    const coupon = await this.client.get(`coupon-info:${couponId}`);
    return JSON.parse(coupon);
  }

  async waitingCouponIssue(
    couponId: number,
    customerId: number,
  ): Promise<void> {
    await this.client.zadd(
      `first-come-coupon:${couponId}`,
      Date.now(),
      customerId,
    );
  }

  async getWaitingListByTimeOrder(
    couponId: number,
    limit: number,
  ): Promise<number[]> {
    const result = await this.client.zrange(
      `first-come-coupon:${couponId}`,
      0,
      limit - 1,
    );
    return result.map((customerId) => Number(customerId));
  }

  async delCouponWaitingList(couponId: number): Promise<void> {
    await this.client.del(`first-come-coupon:${couponId}`);
  }

  async delCouponInfo(couponId: number): Promise<void> {
    await this.client.del(`coupon-info:${couponId}`);
  }

  async removeCustomerFromWaitingList(
    couponId: number,
    limit: number,
  ): Promise<void> {
    await this.client.zpopmin(`first-come-coupon:${couponId}`, limit);
  }
}

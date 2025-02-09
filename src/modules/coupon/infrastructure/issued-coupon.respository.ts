import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IssuedCoupon as IssuedCouponEntity } from '@prisma/client';
import { IssuedCoupon } from '../domain/issued-coupon.domain';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { IssuedCouponDataMapper } from './issued-coupon.data-mapper';
import { IIssuedCouponRepository } from '../application/issued-coupon-repository.interface';
import { CouponDataMapper } from './coupon.data-mapper';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class IssuedCouponRepository implements IIssuedCouponRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly issuedCouponDataMapper: IssuedCouponDataMapper,
    private readonly couponDataMapper: CouponDataMapper,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async getOwnedCoupons(customerId: number): Promise<IssuedCoupon[]> {
    const issuedCouponEntities = await this.prisma.issuedCoupon.findMany({
      where: { customerId },
      include: { coupon: true },
    });

    return issuedCouponEntities.map((issuedCouponEntity) => {
      const issuedCoupon =
        this.issuedCouponDataMapper.toDomain(issuedCouponEntity);
      issuedCoupon.coupon = this.couponDataMapper.toDomain(
        issuedCouponEntity.coupon,
      );
      return issuedCoupon;
    });
  }
  async issueCoupon(issuedCoupon: IssuedCoupon): Promise<IssuedCoupon> {
    const issuedCouponEntity: IssuedCouponEntity =
      this.issuedCouponDataMapper.toEntity(issuedCoupon);
    const createdIssuedCouponEntity = await this.txHost.tx.issuedCoupon.create({
      data: issuedCouponEntity,
    });
    return this.issuedCouponDataMapper.toDomain(createdIssuedCouponEntity);
  }

  async getIssuedCouponByIdWithCoupon(
    issuedCouponId: number,
  ): Promise<IssuedCoupon> {
    const issuedCouponEntity = await this.prisma.issuedCoupon.findUnique({
      where: { id: issuedCouponId },
      include: { coupon: true },
    });

    const issuedCoupon =
      this.issuedCouponDataMapper.toDomain(issuedCouponEntity);
    const coupon = this.couponDataMapper.toDomain(issuedCouponEntity.coupon);
    issuedCoupon.coupon = coupon;

    return issuedCoupon;
  }

  async updateIssuedCoupon(issuedCoupon: IssuedCoupon): Promise<IssuedCoupon> {
    const issuedCouponEntity =
      this.issuedCouponDataMapper.toEntity(issuedCoupon);
    const updatedIssuedCouponEntity = await this.txHost.tx.issuedCoupon.update({
      where: { id: issuedCoupon.id },
      data: issuedCouponEntity,
    });
    return this.issuedCouponDataMapper.toDomain(updatedIssuedCouponEntity);
  }

  async applyIssuedCoupons(issuedCouponList: IssuedCoupon[]): Promise<void> {
    await this.prisma.issuedCoupon.createMany({
      data: issuedCouponList.map((issuedCoupon) =>
        this.issuedCouponDataMapper.toEntity(issuedCoupon),
      ),
    });
  }

  async saveIssuedCouponHistory(
    couponId: number,
    issuedCouponCustomerIds: number[],
  ): Promise<void> {
    await this.redis.sadd(`issued-coupon:${couponId}`, issuedCouponCustomerIds);
  }

  async checkCouponHistory(
    customerId: number,
    couponId: number,
  ): Promise<boolean> {
    const result = await this.redis.sismember(
      `issued-coupon:${couponId}`,
      customerId,
    );
    return result === 1;
  }

  async getIssuedCouponCount(couponId: number): Promise<number> {
    const result = await this.redis.scard(`issued-coupon:${couponId}`);
    return result;
  }

  async delCouponHistory(couponId: number): Promise<void> {
    await this.redis.del(`issued-coupon:${couponId}`);
  }
}

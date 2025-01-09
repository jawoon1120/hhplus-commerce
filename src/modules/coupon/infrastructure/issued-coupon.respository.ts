import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { IssuedCoupon as IssuedCouponEntity } from '@prisma/client';
import { IssuedCoupon } from '../domain/issued-coupon.domain';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { IssuedCouponDataMapper } from './issued-coupon.data-mapper';
import { IIssuedCouponRepository } from '../application/issued-coupon-repository.interface';
import { CouponDataMapper } from './coupon.data-mapper';

@Injectable()
export class IssuedCouponRepository implements IIssuedCouponRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly issuedCouponDataMapper: IssuedCouponDataMapper,
    private readonly couponDataMapper: CouponDataMapper,
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
}

import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ICouponRepository } from '../application/coupon-repository.interface';
import { Injectable } from '@nestjs/common';
import { Coupon as CouponEntity } from '@prisma/client';
import { Coupon } from '../domain/coupon.domain';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CouponDataMapper } from './coupon.data-mapper';

@Injectable()
export class CouponRepository implements ICouponRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
    private readonly couponDataMapper: CouponDataMapper,
  ) {}

  async getCouponByIdWithLock(couponId: number): Promise<Coupon> {
    const couponEntities = await this.txHost.tx.$queryRaw<
      CouponEntity[]
    >`SELECT * FROM Coupon WHERE id = ${couponId} FOR UPDATE`;

    const couponEntity = couponEntities[0];
    return this.couponDataMapper.toDomain(couponEntity);
  }

  async decreaseCouponQuantityOnlyOne(couponId: number): Promise<void> {
    await this.txHost.tx.coupon.update({
      where: { id: couponId },
      data: { remainingQuantity: { decrement: 1 } },
    });
  }

  async getCoupons(): Promise<Coupon[]> {
    const couponEnties: CouponEntity[] = await this.prisma.coupon.findMany();
    return couponEnties.map((couponEntity) =>
      this.couponDataMapper.toDomain(couponEntity),
    );
  }
}

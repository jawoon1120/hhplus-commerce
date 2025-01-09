import { Injectable } from '@nestjs/common';
import { Coupon as CouponEntity } from '@prisma/client';
import { DataMapper } from '../../../infrastructure/data-mapper';
import { Coupon, CouponType } from '../domain/coupon.domain';

@Injectable()
export class CouponDataMapper extends DataMapper<Coupon, CouponEntity> {
  toDomain(couponEntity: CouponEntity): Coupon {
    if (!couponEntity) {
      return null;
    }
    return Coupon.create({
      id: couponEntity.id,
      name: couponEntity.name,
      type: couponEntity.type as CouponType,
      discountAmount: couponEntity.discountAmount,
      startDate: couponEntity.startDate,
      endDate: couponEntity.endDate,
      totalQuantity: couponEntity.totalQuantity,
      remainingQuantity: couponEntity.remainingQuantity,
      createdAt: couponEntity.createdAt,
      updatedAt: couponEntity.updatedAt,
      deletedAt: couponEntity.deletedAt,
    });
  }

  toEntity(coupon: Coupon): CouponEntity {
    if (!coupon) {
      return null;
    }
    return {
      id: coupon.id,
      name: coupon.name,
      type: coupon.type,
      discountAmount: coupon.discountAmount,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      totalQuantity: coupon.totalQuantity,
      remainingQuantity: coupon.remainingQuantity,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
      deletedAt: coupon.deletedAt,
    };
  }
}

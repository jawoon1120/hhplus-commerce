import { Injectable } from '@nestjs/common';
import { IssuedCoupon as IssuedCouponEntity } from '@prisma/client';
import { DataMapper } from '../../../infrastructure/data-mapper';
import {
  IssuedCoupon,
  IssuedCouponStatus,
} from '../domain/issued-coupon.domain';

@Injectable()
export class IssuedCouponDataMapper extends DataMapper<
  IssuedCoupon,
  IssuedCouponEntity
> {
  toDomain(issuedCouponEntity: IssuedCouponEntity): IssuedCoupon {
    if (!issuedCouponEntity) {
      return null;
    }
    return IssuedCoupon.create({
      id: issuedCouponEntity.id,
      customerId: issuedCouponEntity.customerId,
      couponId: issuedCouponEntity.couponId,
      expiredDate: issuedCouponEntity.expiredDate,
      status: issuedCouponEntity.status as IssuedCouponStatus,
      createdAt: issuedCouponEntity.createdAt,
      updatedAt: issuedCouponEntity.updatedAt,
      deletedAt: issuedCouponEntity.deletedAt,
    });
  }

  toEntity(issuedCoupon: IssuedCoupon): IssuedCouponEntity {
    if (!issuedCoupon) {
      return null;
    }
    return {
      id: issuedCoupon.id,
      customerId: issuedCoupon.customerId,
      couponId: issuedCoupon.couponId,
      expiredDate: issuedCoupon.expiredDate,
      status: issuedCoupon.status,
      createdAt: issuedCoupon.createdAt,
      updatedAt: issuedCoupon.updatedAt,
      deletedAt: issuedCoupon.deletedAt,
    };
  }
}

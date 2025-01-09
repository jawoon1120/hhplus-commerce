import { ApiProperty } from '@nestjs/swagger';
import {
  IssuedCoupon,
  IssuedCouponStatus,
} from '../../domain/issued-coupon.domain';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CouponType } from '../../domain/coupon.domain';

export class OwnedCouponQueryDto {
  @ApiProperty({
    description: '발급된 쿠폰 id',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: '할인 양',
    example: 10000,
  })
  @IsNumber()
  @IsNotEmpty()
  discountAmount: number;

  @ApiProperty({
    description: '쿠폰 타입',
    example: 'PERCENT',
  })
  @IsEnum(CouponType)
  @IsNotEmpty()
  type: CouponType;

  @ApiProperty({
    description: '쿠폰 상태',
    example: 'UNUSED',
  })
  @IsEnum(IssuedCouponStatus)
  @IsNotEmpty()
  status: IssuedCouponStatus;

  @ApiProperty({
    description: '쿠폰 만료 일자',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsNotEmpty()
  expirationDate: string;

  static create(issuedCoupon: IssuedCoupon): OwnedCouponQueryDto {
    return {
      id: issuedCoupon.id,
      discountAmount: issuedCoupon.coupon.discountAmount,
      type: issuedCoupon.coupon.type,
      status: issuedCoupon.status,
      expirationDate: issuedCoupon.expiredDate.toISOString(),
    };
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CouponIssueRequestDto {
  @ApiProperty({
    description: '사용자 id',
  })
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty({
    description: '쿠폰 id',
  })
  @IsNumber()
  @IsNotEmpty()
  couponId: number;
}

export class CouponIssueResponseDto {
  @ApiProperty({
    description: '발급된 쿠폰 id',
  })
  issuedCouponId: number;
}

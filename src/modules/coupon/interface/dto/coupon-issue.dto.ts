import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CouponIssueRequestDto {
  @ApiProperty({
    description: '사용자 id',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: '쿠폰 id',
  })
  @IsNumber()
  @IsNotEmpty()
  couponId: number;
}

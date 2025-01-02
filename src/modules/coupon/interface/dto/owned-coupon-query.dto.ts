import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class OwnedCouponQueryDto {
  @ApiProperty({
    description: '발급된 쿠폰 id',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: '할인 금액',
    example: 10000,
  })
  @IsNumber()
  @IsNotEmpty()
  discountAmount: number;

  @ApiProperty({
    description: '쿠폰 만료 일자',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsNotEmpty()
  expirationDate: string;
}

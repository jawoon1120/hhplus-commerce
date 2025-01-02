import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CouponQueryDto {
  @ApiProperty({
    description: '쿠폰 id',
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
    description: '쿠폰 발급 가능 시작일자',
    example: '2023-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: '쿠폰 발급 가능 종료일자',
    example: '2023-12-31',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: '남은 수량',
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  remainingQuantity: number;
}

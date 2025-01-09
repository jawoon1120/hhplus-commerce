import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PaymentCreateRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  issuedCouponId?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  customerId: number;
}

export class PaymentCreateResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  paymentId: number;
}

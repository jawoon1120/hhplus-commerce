import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentCreateRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class PaymentCreateResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  paymentId: number;
}

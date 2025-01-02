import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class PaymentInfoDto {
  constructor(paymentInfo: PaymentInfoDto) {
    this.productId = paymentInfo.productId;
    this.quantity = paymentInfo.quantity;
    this.combinedPrice = paymentInfo.combinedPrice;
  }

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  combinedPrice: number;
}

export class PaymentInfoResponseDto {
  constructor(paymentInfos: PaymentInfoDto[], totalPrice: number) {
    this.paymentInfos = paymentInfos;
    this.totalPrice = totalPrice;
  }

  @IsArray()
  @ApiProperty({ type: [PaymentInfoDto] })
  @ValidateNested({ each: true })
  @Type(() => PaymentInfoDto)
  paymentInfos: PaymentInfoDto[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}

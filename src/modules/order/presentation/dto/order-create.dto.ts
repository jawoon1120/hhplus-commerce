import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class OrderCreateRequestDto {
  @IsArray()
  @ApiProperty({ type: [OrderDto] })
  @ValidateNested({ each: true })
  @Type(() => OrderDto)
  products: OrderDto[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  customerId: number;
}

export class OrderDetailDto {
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
  totalPrice: number;
}

export class OrderCreateResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  orderDetails: OrderDetailDto[];
}

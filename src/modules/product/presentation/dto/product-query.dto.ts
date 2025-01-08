import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductQueryDto {
  @ApiProperty({
    description: '상품 id',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: '상품 이름',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '상품 가격',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: '잔여 수량',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}

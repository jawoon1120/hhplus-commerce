import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('products')
export class ProductController {
  @Get()
  @ApiOperation({
    summary: '상품 조회 with pagination',
    description: '상품을 조회합니다.',
  })
  @ApiOkResponse({
    description: '상품 조회 성공',
    type: [ProductQueryDto],
  })
  getProducts(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('page') page: number = 1,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('limit') limit: number = 10,
  ): ProductQueryDto[] {
    const mockProducts: ProductQueryDto[] = [
      {
        id: 1,
        name: '상품1',
        price: 10000,
        remainingQuantity: 10,
      },
    ];
    return mockProducts;
  }

  @Get('/three-day-popular')
  @ApiOperation({
    summary: '인기 상품 조회',
    description: '최근 3일간 가장 많이 주문된 5개의 상품을 조회합니다.',
  })
  @ApiOkResponse({
    description: '인기 상품 조회 성공',
    type: [ProductQueryDto],
  })
  getPopularProducts(): ProductQueryDto[] {
    const mockPopularProducts: ProductQueryDto[] = [
      {
        id: 1,
        name: '인기상품1',
        price: 10000,
        remainingQuantity: 5,
      },
      {
        id: 2,
        name: '인기상품2',
        price: 20000,
        remainingQuantity: 3,
      },
      {
        id: 3,
        name: '인기상품3',
        price: 15000,
        remainingQuantity: 8,
      },
      {
        id: 4,
        name: '인기상품4',
        price: 25000,
        remainingQuantity: 2,
      },
      {
        id: 5,
        name: '인기상품5',
        price: 30000,
        remainingQuantity: 4,
      },
    ];
    return mockPopularProducts;
  }
}

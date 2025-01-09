import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductService } from '../application/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: '상품 조회 with pagination',
    description: '상품을 조회합니다.',
  })
  @ApiOkResponse({
    description: '상품 조회 성공',
    type: [ProductQueryDto],
  })
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<ProductQueryDto[]> {
    const products = await this.productService.findWithPaginationAndLock(
      page,
      limit,
    );

    return products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      };
    });
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
  async getPopularProducts(): Promise<ProductQueryDto[]> {
    const products = await this.productService.getPopularProductsDuring3Days();
    return products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      };
    });
  }
}

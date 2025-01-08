import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../domain/product-repository.interface';
import { Product } from '../domain/product.domain';

@Injectable()
export class ProductService {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async findWithPaginationAndLock(
    page: number,
    limit: number,
  ): Promise<Product[]> {
    return await this.productRepository.findWithPaginationAndLock(page, limit);
  }

  async consumeStock(id: number, consumeStockAmount: number): Promise<Product> {
    if (consumeStockAmount <= 0) {
      throw new BadRequestException(
        'consumeStockAmount must be greater than 0',
      );
    }
    return await this.productRepository.consumeStock(id, consumeStockAmount);
  }
}

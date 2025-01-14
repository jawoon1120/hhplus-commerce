import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '../domain/product-repository.interface';
import { Product } from '../domain/product.domain';
import { NotFoundException } from '../../../common/custom-exception/not-found.exception';
import { Transactional } from '@nestjs-cls/transactional';

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

  @Transactional()
  async consumeStockList(
    consumeStockList: { id: number; consumeStockAmount: number }[],
  ): Promise<Product[]> {
    const products = await this.productRepository.findByIdsWithLock(
      consumeStockList.map((item) => item.id),
    );

    if (products.length === 0) {
      throw new NotFoundException('Product not found');
    }

    products.forEach((product) => {
      product.consumeStock(
        consumeStockList.find((item) => item.id === product.id)
          ?.consumeStockAmount,
      );
    });

    await this.productRepository.applyStockList(products);

    return products;
  }

  async getPopularProductsDuring3Days(): Promise<Product[]> {
    return await this.productRepository.findPopularProducts(3);
  }
}

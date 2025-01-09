import { Inject, Injectable } from '@nestjs/common';
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

  async consumeStockList(
    consumeStockList: { id: number; consumeStockAmount: number }[],
  ): Promise<Product[]> {
    const products = await this.productRepository.findByIdsWithLock(
      consumeStockList.map((item) => item.id),
    );

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

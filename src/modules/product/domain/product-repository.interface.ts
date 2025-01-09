import { Product } from './product.domain';

export interface IProductRepository {
  findWithPaginationAndLock(page: number, limit: number): Promise<Product[]>;
  findByIdsWithLock(ids: number[]): Promise<Product[]>;
  applyStockList(products: Product[]): Promise<Product[]>;
}

export const IProductRepository = Symbol('IProductRepository');

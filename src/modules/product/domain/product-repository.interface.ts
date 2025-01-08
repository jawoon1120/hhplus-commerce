import { Product } from './product.domain';

export interface IProductRepository {
  findWithPaginationAndLock(page: number, limit: number): Promise<Product[]>;
  consumeStock(id: number, consumeStockAmount: number): Promise<Product>;
}

export const IProductRepository = Symbol('IProductRepository');

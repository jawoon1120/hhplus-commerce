import { DataMapper } from '../../../infrastructure/data-mapper';
import { Product as ProductEntity } from '@prisma/client';
import { Product } from '../domain/product.domain';

export class ProductDataMapper extends DataMapper<Product, ProductEntity> {
  toDomain(entity: ProductEntity): Product {
    return new Product(entity);
  }

  toEntity(domain: Product): ProductEntity {
    return {
      id: domain.id,
      name: domain.name,
      price: domain.price,
      sellerId: domain.sellerId,
      totalQuantity: domain.totalQuantity,
      stock: domain.stock,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt,
    };
  }
}

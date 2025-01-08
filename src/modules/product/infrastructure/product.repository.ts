import { Injectable } from '@nestjs/common';

import { Prisma, Product as ProductEntity } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ProductDataMapper } from './product.data-mapper';
import { Product } from '../domain/product.domain';
import { IProductRepository } from '../domain/product-repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productDataMapper: ProductDataMapper,
  ) {}
  async findById(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return this.productDataMapper.toDomain(product);
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return products.map((product) => this.productDataMapper.toDomain(product));
  }

  async findWithPaginationAndLock(
    page: number,
    limit: number,
  ): Promise<Product[]> {
    const offset = (page - 1) * limit;

    const products = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const _products: ProductEntity[] = await tx.$queryRaw<
          ProductEntity[]
        >`SELECT * FROM Product ORDER BY name ASC LIMIT ${limit} OFFSET ${offset} FOR SHARE`;

        return _products;
      },
    );

    return products.map((product) => this.productDataMapper.toDomain(product));
  }

  async findByIdsWithLock(ids: number[]): Promise<Product[]> {
    const products = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const _products: ProductEntity[] = await tx.$queryRaw<ProductEntity[]>`
          SELECT * FROM Product 
          WHERE id IN (${Prisma.join(ids)}) 
          FOR SHARE
        `;

        return _products;
      },
    );

    return products.map((product) => this.productDataMapper.toDomain(product));
  }

  async consumeStock(id: number, consumeStockAmount: number): Promise<Product> {
    const consumedStockProduct = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const products = await tx.$queryRaw<ProductEntity[]>`
        SELECT * FROM Product WHERE id = ${id} FOR UPDATE
      `;

        if (products.length === 0) {
          throw new Error('Product not found');
        }

        const product = products[0];
        if (product.stock < consumeStockAmount) {
          throw new Error('재고가 부족합니다');
        }

        const updatedProduct = await tx.product.update({
          where: { id },
          data: { stock: { decrement: consumeStockAmount } },
        });
        return updatedProduct;
      },
    );

    return this.productDataMapper.toDomain(consumedStockProduct);
  }
}

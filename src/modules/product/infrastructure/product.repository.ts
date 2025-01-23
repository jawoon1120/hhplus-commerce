import { Injectable } from '@nestjs/common';

import { Prisma, Product as ProductEntity } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ProductDataMapper } from './product.data-mapper';
import { Product } from '../domain/product.domain';
import { IProductRepository } from '../domain/product-repository.interface';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productDataMapper: ProductDataMapper,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
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
    const products: ProductEntity[] = await this.txHost.tx.$queryRaw<
      ProductEntity[]
    >`
          SELECT * FROM Product 
          WHERE id IN (${Prisma.join(ids)})
        `;

    return products.map((product) => this.productDataMapper.toDomain(product));
  }

  async applyStockList(products: Product[]): Promise<Product[]> {
    const productEntities = products.map((product) =>
      this.productDataMapper.toEntity(product),
    );
    await Promise.all(
      productEntities.map(async (product) => {
        await this.txHost.tx.product.update({
          where: { id: product.id },
          data: product,
        });
      }),
    );
    return productEntities.map((product) =>
      this.productDataMapper.toDomain(product),
    );
  }

  async findPopularProducts(days: number): Promise<Product[]> {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const products = await this.txHost.tx.product.findMany({
      where: {
        orderDetails: {
          some: {
            order: {
              payment: {
                status: 'COMPLETED',
                createdAt: {
                  gte: daysAgo,
                },
              },
            },
          },
        },
      },
      include: {
        orderDetails: {
          where: {
            order: {
              payment: {
                status: 'COMPLETED',
                createdAt: {
                  gte: daysAgo,
                },
              },
            },
          },
        },
      },
      orderBy: {
        orderDetails: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return products.map((product) => this.productDataMapper.toDomain(product));
  }
}

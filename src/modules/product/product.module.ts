import { Module } from '@nestjs/common';
import { ProductController } from './presentation/product.controller';
import { ProductService } from './application/product.service';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { ProductRepository } from './infrastructure/product.repository';
import { IProductRepository } from './domain/product-repository.interface';
import { ProductDataMapper } from './infrastructure/product.data-mapper';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    { provide: IProductRepository, useClass: ProductRepository },
    ProductDataMapper,
  ],
})
export class ProductModule {}

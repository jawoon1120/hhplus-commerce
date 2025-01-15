import { Test, TestingModule } from '@nestjs/testing';
import { PrismaMockService } from '../prisma-service.mock';
import { seedAll } from '../util/seed';
import { ProductService } from '../../../src/modules/product/application/product.service';
import { ClsModule } from 'nestjs-cls';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { clsModuleMockOption } from '../cls-module.mock';
import { Product as ProductEntity } from '@prisma/client';

describe('Production Service 동시성 테스트', () => {
  let productService: ProductService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useClass(PrismaMockService)
      .overrideModule(ClsModule)
      .useModule(ClsModule.forRoot(clsModuleMockOption))
      .compile();

    productService = moduleRef.get<ProductService>(ProductService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await seedAll(prismaService);
  });

  it('상품 재고 동시에 소모 했을 때 손실 없이 소모되는지 확인', async () => {
    const productId = 1;
    const consumedStock = 2;
    const requests = Array.from({ length: 5 }, () =>
      productService.consumeStockList([
        { id: productId, consumeStockAmount: consumedStock },
      ]),
    );

    const results = await Promise.allSettled(requests);

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        expect(result.value).toBeInstanceOf(Array);
      }
    });

    const savedProduct = await prismaService.$queryRaw<
      ProductEntity[]
    >`SELECT * FROM hhpluscommerce.Product WHERE id = ${productId} for update`;

    expect(savedProduct[0].stock).toBe(15 - consumedStock * 5);
  });
});

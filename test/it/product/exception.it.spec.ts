import { Test, TestingModule } from '@nestjs/testing';
import { PrismaMockService } from '../prisma-service.mock';
import { ProductService } from '../../../src/modules/product/application/product.service';
import { ClsModule } from 'nestjs-cls';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { clsModuleMockOption } from '../cls-module.mock';
import { NotFoundException } from '../../../src/common/custom-exception/not-found.exception';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('ProductService 예외처리', () => {
  let productService: ProductService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useClass(PrismaMockService)
      .overrideModule(ClsModule)
      .useModule(ClsModule.forRoot(clsModuleMockOption))
      .overrideModule(RedisModule)
      .useModule(
        RedisModule.forRootAsync({
          useFactory: () => ({
            type: 'single',
            url: process.env.REDIS_URL,
          }),
        }),
      )
      .compile();

    productService = moduleRef.get<ProductService>(ProductService);
  });

  it('존재하지 않는 상품을 조회시 에러 발생', async () => {
    // given
    const existingProductId = 4;
    const consumeStockAmount = 1;

    // when & then
    await expect(
      productService.consumeStockList([
        { id: existingProductId, consumeStockAmount },
      ]),
    ).rejects.toThrow(NotFoundException);
  });
});

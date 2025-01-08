import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { MockPrismaService } from '../prisma-service.mock';
import { ProductRepository } from '../../../src/modules/product/infrastructure/product.repository';
import { ProductDataMapper } from '../../../src/modules/product/infrastructure/product.data-mapper';

describe('BalanceRepository 동시성 테스트', () => {
  let productRepository: ProductRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
        ProductRepository,
        ProductDataMapper,
      ],
    }).compile();

    productRepository = moduleRef.get<ProductRepository>(ProductRepository);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe('consumeStock', () => {
    it('존재하지 않는 상품의 재고를 소비하려고 할 때 에러를 반환한다', async () => {
      // given
      const nonExistentProductId = 999;
      const consumeAmount = 1;

      // when & then
      await expect(
        productRepository.consumeStock(nonExistentProductId, consumeAmount),
      ).rejects.toThrow('Product not found');
    });

    it('재고보다 많은 수량을 소비하려고 할 때 에러를 반환한다', async () => {
      // given
      const productId = 1;
      const currentStock = 10;
      const consumeAmount = currentStock + 1;

      await prismaService.product.update({
        where: { id: productId },
        data: { stock: currentStock },
      });

      // when & then
      await expect(
        productRepository.consumeStock(productId, consumeAmount),
      ).rejects.toThrow('재고가 부족합니다');
    });
  });
});

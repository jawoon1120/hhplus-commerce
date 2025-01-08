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

  it('상품 재고 동시에 소모 했을 때 손실 없이 소모되는지 확인', async () => {
    const productId = 1; // 테스트할 고객 ID
    const consumedStock = 2;
    const requests = Array.from({ length: 5 }, () =>
      productRepository.consumeStock(productId, consumedStock),
    );

    await Promise.allSettled(requests);

    const savedProduct = await prismaService.product.findUnique({
      where: { id: productId },
    });
    expect(savedProduct.stock).toBe(10 - consumedStock * 5);
  });
});

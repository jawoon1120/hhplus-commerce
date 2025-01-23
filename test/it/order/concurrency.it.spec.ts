import { Test, TestingModule } from '@nestjs/testing';
import { PrismaMockService } from '../prisma-service.mock';
import { seedAll } from '../util/seed';
import { OrderFacade } from '../../../src/modules/order/application/order.facade';
import { ClsModule } from 'nestjs-cls';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { clsModuleMockOption } from '../cls-module.mock';
import { OrderCreateRequestDto } from '../../../src/modules/order/presentation/dto/order-create.dto';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('Order Service 동시성 테스트', () => {
  let orderFacade: OrderFacade;
  let prismaService: PrismaService;

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

    orderFacade = moduleRef.get<OrderFacade>(OrderFacade);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await seedAll(prismaService);
  });

  it('동시에 여러 주문이 들어왔을 때 재고가 정확하게 차감되는지 확인', async () => {
    // given
    const productId = 2;
    const orderQuantity = 2;
    const customerId = 1;
    const concurrentOrders = 5;

    const orderCreateDto: OrderCreateRequestDto = {
      customerId: customerId,
      products: [
        {
          productId: productId,
          quantity: orderQuantity,
        },
      ],
    };

    // when
    const requests = Array.from({ length: concurrentOrders }, () =>
      orderFacade.createOrder(orderCreateDto),
    );

    const results = await Promise.allSettled(requests);

    // then
    const successfulOrders = results.filter(
      (result) => result.status === 'fulfilled',
    ).length;

    const savedProduct = await prismaService.product.findUnique({
      where: { id: productId },
    });

    expect(savedProduct.stock).toBe(10 - orderQuantity * successfulOrders);
  });
});

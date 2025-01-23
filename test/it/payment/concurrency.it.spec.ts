import { Test, TestingModule } from '@nestjs/testing';
import { PrismaMockService } from '../prisma-service.mock';
import { seedAll } from '../util/seed';
import { PaymentFacade } from '../../../src/modules/payment/application/payment.facade';
import { ClsModule } from 'nestjs-cls';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { clsModuleMockOption } from '../cls-module.mock';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('Payment Service 동시성 테스트', () => {
  let paymentFacade: PaymentFacade;
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

    paymentFacade = moduleRef.get<PaymentFacade>(PaymentFacade);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await seedAll(prismaService);
  });

  it('동시에 여러 결제가 들어왔을 때 잔액이 정확하게 차감되는지 확인', async () => {
    // given : seed 파일
    const customerId = 3;
    const orderId = 1;
    const paymentAmount = 8000;
    const initialBalance = 30000;
    const concurrentPayments = 5;

    // when
    const requests = Array.from({ length: concurrentPayments }, () =>
      paymentFacade.makePayment(orderId, customerId, null),
    );

    const results = await Promise.allSettled(requests);

    // then
    const successfulPayments = results.filter(
      (result) => result.status === 'fulfilled',
    ).length;

    const savedBalance = await prismaService.balance.findUnique({
      where: { customerId },
    });

    expect(savedBalance.amount).toBe(
      initialBalance - paymentAmount * successfulPayments,
    );
  });

  it('동시에 여러 결제가 들어왔을 때 잔액 부족으로 실패하는 경우 확인', async () => {
    // given
    const customerId = 4;
    const orderId = 1;
    const concurrentPayments = 5;

    // when
    const requests = Array.from({ length: concurrentPayments }, () =>
      paymentFacade.makePayment(orderId, customerId, null),
    );

    const results = await Promise.allSettled(requests);

    // then
    const failedPayments = results.filter(
      (result) => result.status === 'rejected',
    ).length;

    expect(failedPayments).toBeGreaterThan(0);

    const savedBalance = await prismaService.balance.findUnique({
      where: { customerId },
    });

    expect(savedBalance.amount).toBeGreaterThanOrEqual(0);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BalanceFacade } from '../../../src/modules/balance/application/balance.facade';
import { ClsModule } from 'nestjs-cls';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { PrismaMockService } from '../prisma-service.mock';
import { AppModule } from '../../../src/app.module';
import { clsModuleMockOption } from '../cls-module.mock';

describe('BalanceRepository 동시성 테스트', () => {
  let balanceFacade: BalanceFacade;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useClass(PrismaMockService)
      .overrideModule(ClsModule)
      .useModule(ClsModule.forRoot(clsModuleMockOption))
      .compile();

    balanceFacade = moduleRef.get<BalanceFacade>(BalanceFacade);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should handle concurrent balance charge requests with optimistic concurrency control', async () => {
    const customerId = 2; // 테스트할 고객 ID
    const initialBalance = 30000; // Seed data 초기 잔액
    const chargeAmount = 100; // 충전할 금액

    const requests = Array.from({ length: 5 }, () =>
      balanceFacade.chargeBalance(customerId, chargeAmount),
    );

    const results = await Promise.allSettled(requests);

    const rejectedCount = results.filter(
      (result) => result.status === 'rejected',
    ).length;
    expect(rejectedCount).toBeGreaterThan(0);

    const balance = await prisma.balance.findUnique({
      where: { customerId: customerId },
    });

    expect(balance.amount).toBeLessThan(initialBalance + chargeAmount * 5);
  });
});

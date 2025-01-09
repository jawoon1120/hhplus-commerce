import { Test, TestingModule } from '@nestjs/testing';
import { BalanceRepository } from '../../../src/modules/balance/infrastructure/balance.repository';
import { BalanceDataMapper } from '../../../src/modules/balance/infrastructure/balance.data-mapper';
import { Balance } from '../../../src/modules/balance/domain/balance.domain';
import { PrismaService } from '../../../src/infrastructure/database/prisma.service';
import { MockPrismaService } from '../prisma-service.mock';

describe('BalanceRepository 동시성 테스트', () => {
  let balanceRepository: BalanceRepository;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useClass: MockPrismaService,
        },
        BalanceRepository,
        BalanceDataMapper,
      ],
    }).compile();

    balanceRepository = moduleRef.get<BalanceRepository>(BalanceRepository);
  });

  it('should handle concurrent balance charge requests without loss', async () => {
    const customerId = 1; // 테스트할 고객 ID
    const initialBalance = 1000; // Seed data 초기 잔액
    const chargeAmount = 100; // 충전할 금액
    const requests = Array.from({ length: 5 }, () =>
      balanceRepository.chargeBalance(customerId, chargeAmount),
    );

    const results = await Promise.allSettled(requests);

    // 모든 요청이 성공했는지 확인
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        expect(result.value).toBeInstanceOf(Balance);
      }
    });

    const balance = await balanceRepository.getBalanceByUserId(customerId);
    expect(balance.amount).toBe(initialBalance + chargeAmount * 5);
  });

  it('should handle concurrent balance withdrawal requests without loss', async () => {
    const customerId = 1; // 테스트할 고객 ID
    const initialBalance = 1500; // 초기 잔액
    const withdrawAmount = 100; // 인출할 금액

    const requests = Array.from({ length: 5 }, () =>
      balanceRepository.withdrawBalance(customerId, withdrawAmount),
    );

    const results = await Promise.allSettled(requests);

    // 모든 요청이 성공했는지 확인
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        expect(result.value).toBeInstanceOf(Balance);
      }
    });

    const balance = await balanceRepository.getBalanceByUserId(customerId);
    expect(balance.amount).toBe(initialBalance - withdrawAmount * 5);
  });
});

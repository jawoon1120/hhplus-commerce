import { Test, TestingModule } from '@nestjs/testing';
import { BalanceService } from './balance.service';
import { IBalanceRepository } from '../domain/balance-repository.interface';
import { CustomerService } from '../../customer/application/customer.service';

describe('BalanceService', () => {
  let service: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: IBalanceRepository,
          useValue: {
            getBalanceByUserId: jest.fn(),
            chargeBalance: jest.fn(),
            withdrawBalance: jest.fn(),
          },
        },
        {
          provide: CustomerService,
          useValue: {
            getCustomerById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

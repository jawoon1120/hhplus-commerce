import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';

import { ICustomerRepository } from './customer-repository.interface';
import { Customer } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: CustomerService;
  let customerRepository: ICustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: ICustomerRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<ICustomerRepository>(ICustomerRepository);
  });

  it('존재하는 유저를 조회할 때 해당 유저 정보를 반환한다', async () => {
    const mockCustomer: Customer = {
      id: 1,
      name: '김항해',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    customerRepository.findById = jest.fn().mockResolvedValue(mockCustomer);

    const result = await service.getCustomerById(1);
    expect(result).toEqual(mockCustomer);
    expect(customerRepository.findById).toHaveBeenCalledWith(1);
  });

  it('존재하지 않는 유저를 조회할 때 Not Found Exception을 반환한다', async () => {
    customerRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(service.getCustomerById(999)).rejects.toThrow(
      NotFoundException,
    );
    expect(customerRepository.findById).toHaveBeenCalledWith(999);
  });
});

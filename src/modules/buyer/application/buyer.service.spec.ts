import { Test, TestingModule } from '@nestjs/testing';
import { BuyerService } from './buyer.service';

import { IBuyerRepository } from './buyer-repository.interface';
import { Buyer } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: BuyerService;
  let buyerRepository: IBuyerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuyerService,
        {
          provide: IBuyerRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BuyerService>(BuyerService);
    buyerRepository = module.get<IBuyerRepository>(IBuyerRepository);
  });

  it('존재하는 유저를 조회할 때 해당 유저 정보를 반환한다', async () => {
    const mockBuyer: Buyer = {
      id: 1,
      name: '김항해',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    buyerRepository.findById = jest.fn().mockResolvedValue(mockBuyer);

    const result = await service.getBuyerById(1);
    expect(result).toEqual(mockBuyer);
    expect(buyerRepository.findById).toHaveBeenCalledWith(1);
  });

  it('존재하지 않는 유저를 조회할 때 Not Found Exception을 반환한다', async () => {
    buyerRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(service.getBuyerById(999)).rejects.toThrow(NotFoundException);
    expect(buyerRepository.findById).toHaveBeenCalledWith(999);
  });
});

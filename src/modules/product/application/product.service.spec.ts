import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { IProductRepository } from '../domain/product-repository.interface';
import { BadRequestException } from '@nestjs/common';
import { Product } from '../domain/product.domain';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: IProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: IProductRepository,
          useValue: {
            findWithPaginationAndLock: jest.fn(),
            consumeStock: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<IProductRepository>(IProductRepository);
  });

  describe('consumeStock', () => {
    it('상품의 재고를 정상적으로 소모한다', async () => {
      // given
      const mockProduct: Product = {
        id: 1,
        name: '테스트 상품',
        price: 1000,
        sellerId: 1,
        totalQuantity: 100,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const consumeAmount = 10;
      productRepository.consumeStock = jest.fn().mockResolvedValue(mockProduct);

      // when
      const result = await service.consumeStock(1, consumeAmount);

      // then
      expect(result).toEqual(mockProduct);
      expect(productRepository.consumeStock).toHaveBeenCalledWith(
        1,
        consumeAmount,
      );
    });

    it('소모하려는 재고가 0 이하일 경우 BadRequestException을 던진다', async () => {
      // given
      const consumeAmount = 0;

      // when & then
      await expect(service.consumeStock(1, consumeAmount)).rejects.toThrow(
        BadRequestException,
      );
      expect(productRepository.consumeStock).not.toHaveBeenCalled();
    });
  });
});

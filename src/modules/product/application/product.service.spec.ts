import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { IProductRepository } from '../domain/product-repository.interface';
import { Product } from '../domain/product.domain';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: IProductRepository,
          useValue: {
            findByIdsWithLock: jest.fn(),
            applyStockList: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(IProductRepository);
  });

  describe('consumeStockList', () => {
    it('상품들의 재고를 정상적으로 소모한다', async () => {
      // given
      const mockProducts = [
        new Product({
          id: 1,
          name: '상품1',
          price: 1000,
          sellerId: 1,
          totalQuantity: 100,
          stock: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new Product({
          id: 2,
          name: '상품2',
          price: 2000,
          sellerId: 1,
          totalQuantity: 100,
          stock: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const consumeStockList = [
        { id: 1, consumeStockAmount: 10 },
        { id: 2, consumeStockAmount: 5 },
      ];

      productRepository.findByIdsWithLock.mockResolvedValue(mockProducts);
      productRepository.applyStockList.mockResolvedValue(mockProducts);

      // when
      const result = await service.consumeStockList(consumeStockList);

      // then
      expect(result).toHaveLength(2);
      expect(result[0].stock).toBe(40); // 50 - 10
      expect(result[1].stock).toBe(25); // 30 - 5
      expect(productRepository.findByIdsWithLock).toHaveBeenCalledWith([1, 2]);
      expect(productRepository.applyStockList).toHaveBeenCalled();
    });

    it('재고보다 많은 수량을 요청시 에러를 반환한다', async () => {
      // given
      const mockProducts = [
        new Product({
          id: 1,
          name: '상품1',
          price: 1000,
          sellerId: 1,
          totalQuantity: 100,
          stock: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const consumeStockList = [{ id: 1, consumeStockAmount: 10 }];

      productRepository.findByIdsWithLock.mockResolvedValue(mockProducts);

      // when & then
      await expect(service.consumeStockList(consumeStockList)).rejects.toThrow(
        '재고가 부족합니다',
      );
    });
  });
});

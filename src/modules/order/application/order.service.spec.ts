import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { IOrderRepository } from './order-repository.interface';
import { Order } from '../domain/order.domain';
import { NotFoundException } from '../../../common/custom-exception/not-found.exception';

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository: jest.Mocked<IOrderRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: IOrderRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get(IOrderRepository);
  });

  describe('getOrderById', () => {
    it('주문 ID로 주문을 성공적으로 조회해야 함', async () => {
      // Given
      const mockOrder = new Order({ id: 1 });

      orderRepository.findById.mockResolvedValue(mockOrder);

      // When
      const result = await orderService.getOrderById(1);

      // Then
      expect(result).toBe(mockOrder);
      expect(orderRepository.findById).toHaveBeenCalledWith(1);
    });

    it('존재하지 않는 주문 ID로 조회시 NotFoundException을 발생시켜야 함', async () => {
      // Given
      orderRepository.findById.mockResolvedValue(null);

      // When & Then
      await expect(orderService.getOrderById(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(orderRepository.findById).toHaveBeenCalledWith(999);
    });
  });
});

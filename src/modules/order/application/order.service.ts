import { Inject, Injectable } from '@nestjs/common';

import { OrderCreateRequestDto } from '../presentation/dto/order-create.dto';
import { Product } from '../../product/domain/product.domain';
import { Order, OrderStatus } from '../domain/order.domain';
import { OrderDetail } from '../domain/order-detail.domain';
import { IOrderRepository } from './order-repository.interface';

@Injectable()
export class OrderService {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async createOrder(
    orderCreateDto: OrderCreateRequestDto,
    productInfos: Product[],
  ): Promise<Order> {
    const order = Order.create({
      customerId: orderCreateDto.customerId,
      status: OrderStatus.PENDING,
    });

    const orderDetails = OrderDetail.createList(
      productInfos,
      order,
      orderCreateDto.products,
    );
    order.orderDetails = orderDetails;
    order.totalPrice = orderDetails.reduce(
      (acc, curr) => acc + curr.totalPrice,
      0,
    );
    return await this.orderRepository.create(order);
  }
}

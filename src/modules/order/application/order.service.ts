import { Inject, Injectable } from '@nestjs/common';

import { OrderCreateRequestDto } from '../presentation/dto/order-create.dto';
import { Product } from '../../product/domain/product.domain';
import { Order, OrderStatus } from '../domain/order.domain';
import { OrderDetail } from '../domain/order-detail.domain';
import { IOrderRepository } from './order-repository.interface';
import { NotFoundException } from '../../../common/custom-exception/not-found.exception';

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

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrderStatus(order: Order, status: OrderStatus): Promise<Order> {
    order.status = status;
    return await this.orderRepository.update(order);
  }
}

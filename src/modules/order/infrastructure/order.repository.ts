import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../application/order-repository.interface';
import {
  Order as OrderEntity,
  OrderDetail as OrderDetailEntity,
} from '@prisma/client';
import { Order } from '../domain/order.domain';
import { OrderDataMapper } from './order.data-mapper';
import { OrderDetailDataMapper } from './order-detail.data-mapper';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    private readonly orderDataMapper: OrderDataMapper,
    private readonly orderDetailDataMapper: OrderDetailDataMapper,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}
  async create(order: Order): Promise<Order> {
    const orderEntity: OrderEntity = this.orderDataMapper.toEntity(order);
    const orderDetailsEntities: OrderDetailEntity[] = order.orderDetails.map(
      (orderDetail) => this.orderDetailDataMapper.toEntity(orderDetail),
    );

    const createdOrderEntity = await this.txHost.tx.order.create({
      data: {
        ...orderEntity,
        orderDetails: {
          create: orderDetailsEntities,
        },
      },
      include: {
        orderDetails: true,
      },
    });

    const createdOrder = this.orderDataMapper.toDomain(createdOrderEntity);
    const createdOrderDetails = createdOrderEntity.orderDetails.map(
      (orderDetail) => this.orderDetailDataMapper.toDomain(orderDetail),
    );
    createdOrder.orderDetails = createdOrderDetails;
    return createdOrder;
  }
}

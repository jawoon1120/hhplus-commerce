import { Injectable } from '@nestjs/common';
import { Order as OrderEntity } from '@prisma/client';
import { Order, OrderStatus } from '../domain/order.domain';
import { DataMapper } from '../../../infrastructure/data-mapper';

@Injectable()
export class OrderDataMapper extends DataMapper<Order, OrderEntity> {
  toDomain(orderEntity: OrderEntity): Order {
    if (!orderEntity) {
      return null;
    }
    const order = Order.create({
      id: orderEntity.id,
      customerId: orderEntity.customerId,
      status: orderEntity.status as OrderStatus,
      totalPrice: orderEntity.totalPrice,
      createdAt: orderEntity.createdAt,
      updatedAt: orderEntity.updatedAt,
      deletedAt: orderEntity.deletedAt,
    });
    return order;
  }

  toEntity(order: Order): OrderEntity {
    if (!order) {
      return null;
    }
    return {
      id: order.id,
      customerId: order.customerId,
      status: order.status as OrderStatus,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      deletedAt: order.deletedAt,
    };
  }
}

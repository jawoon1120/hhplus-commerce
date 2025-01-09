import { Injectable } from '@nestjs/common';
import { OrderDetail as OrderDetailEntity } from '@prisma/client';
import { DataMapper } from '../../../infrastructure/data-mapper';
import { OrderDetail } from '../domain/order-detail.domain';

@Injectable()
export class OrderDetailDataMapper extends DataMapper<
  OrderDetail,
  OrderDetailEntity
> {
  toDomain(orderDetail: OrderDetailEntity): OrderDetail {
    if (!orderDetail) {
      return null;
    }
    return OrderDetail.create({
      id: orderDetail.id,
      orderId: orderDetail.orderId,
      productId: orderDetail.productId,
      quantity: orderDetail.quantity,
      totalPrice: orderDetail.totalPrice,
      createdAt: orderDetail.createdAt,
      updatedAt: orderDetail.updatedAt,
      deletedAt: orderDetail.deletedAt,
    });
  }

  toEntity(orderDetail: OrderDetail): OrderDetailEntity {
    if (!orderDetail) {
      return null;
    }
    return {
      id: orderDetail.id,
      orderId: orderDetail.orderId,
      productId: orderDetail.productId,
      quantity: orderDetail.quantity,
      totalPrice: orderDetail.totalPrice,
      createdAt: orderDetail.createdAt,
      updatedAt: orderDetail.updatedAt,
      deletedAt: orderDetail.deletedAt,
    };
  }
}

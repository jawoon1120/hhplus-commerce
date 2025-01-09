import { Product } from '../../product/domain/product.domain';
import { Order } from './order.domain';

export class OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(orderDetail: Partial<OrderDetail>) {
    Object.assign(this, orderDetail);
  }

  static create(orderDetail: Partial<OrderDetail>) {
    return new OrderDetail(orderDetail);
  }

  static createList(
    existedProducts: Product[],
    order: Order,
    orderProductInfo: { productId: number; quantity: number }[],
  ): OrderDetail[] {
    const orderDetails = orderProductInfo.map((product) => {
      const targetProduct = existedProducts.find(
        (existedProduct) => existedProduct.id === product.productId,
      );
      return OrderDetail.create({
        orderId: order.id,
        productId: targetProduct.id,
        quantity: product.quantity,
        totalPrice: targetProduct.price * product.quantity,
      });
    });

    return orderDetails;
  }
}

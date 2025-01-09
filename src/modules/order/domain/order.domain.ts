import { Payment } from '../../payment/domain/payment.domain';
import { OrderDetail } from './order-detail.domain';

export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  PAID = 'PAID',
}

export class Order {
  id: number;
  customerId: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  orderDetails: OrderDetail[];
  payments: Payment | null;

  constructor(order: Partial<Order>) {
    if (order) {
      return Object.assign(this, order);
    }
  }

  static create(order: Partial<Order>) {
    return new Order(order);
  }
}

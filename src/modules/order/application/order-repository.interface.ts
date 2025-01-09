import { Order } from '../domain/order.domain';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(orderId: number): Promise<Order>;
  update(order: Order): Promise<Order>;
}

export const IOrderRepository = Symbol('IOrderRepository');

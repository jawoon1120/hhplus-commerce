import { Order } from '../domain/order.domain';

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
}

export const IOrderRepository = Symbol('IOrderRepository');

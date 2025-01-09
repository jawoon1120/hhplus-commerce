import { Customer } from '@prisma/client';

export interface ICustomerRepository {
  findById(id: number): Promise<Customer>;
}

export const ICustomerRepository = Symbol('ICustomerRepository');

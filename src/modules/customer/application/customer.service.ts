import { Inject, Injectable } from '@nestjs/common';
import { ICustomerRepository } from './customer-repository.interface';
import { Customer } from '@prisma/client';
import { NotFoundException } from '../../../common/custom-exception/not-found.exception';

@Injectable()
export class CustomerService {
  constructor(
    @Inject(ICustomerRepository)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
}

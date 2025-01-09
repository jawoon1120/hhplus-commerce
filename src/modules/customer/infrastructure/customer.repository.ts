import { Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../application/customer-repository.interface';

import { Customer } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: number): Promise<Customer> {
    return await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });
  }
}

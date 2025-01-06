import { Module } from '@nestjs/common';
import { CustomerService } from './application/customer.service';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { CustomerRepository } from './infrastructure/customer.repository';
import { ICustomerRepository } from './application/customer-repository.interface';

@Module({
  imports: [PrismaModule],
  providers: [
    CustomerService,
    {
      provide: ICustomerRepository,
      useClass: CustomerRepository,
    },
  ],
  exports: [CustomerService],
})
export class CustomerModule {}

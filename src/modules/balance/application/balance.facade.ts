import { Inject, Injectable } from '@nestjs/common';
import { Balance } from '../domain/balance.domain';
import { CustomerService } from '../../customer/application/customer.service';
import { BalanceService } from './balance.service';

@Injectable()
export class BalanceFacade {
  constructor(
    @Inject(CustomerService)
    private readonly customerService: CustomerService,
    @Inject(BalanceService)
    private readonly balanceService: BalanceService,
  ) {}

  //TODO: customer 여부 판단은 추후 guard로 처리
  async getBalance(customerId: number): Promise<Balance> {
    await this.customerService.getCustomerById(customerId);

    return await this.balanceService.getBalance(customerId);
  }

  //TODO: customer 여부 판단은 추후 guard로 처리
  async chargeBalance(customerId: number, amount: number): Promise<Balance> {
    await this.customerService.getCustomerById(customerId);

    return await this.balanceService.chargeBalance(customerId, amount);
  }

  //TODO: customer 여부 판단은 추후 guard로 처리
  async withdrawBalance(customerId: number, amount: number): Promise<Balance> {
    await this.customerService.getCustomerById(customerId);

    return await this.balanceService.withdrawBalance(customerId, amount);
  }
}

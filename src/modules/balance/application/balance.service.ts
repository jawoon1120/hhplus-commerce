import { Inject, Injectable } from '@nestjs/common';
import { IBalanceRepository } from '../domain/balance-repository.interface';
import { Balance } from '../domain/balance.domain';
import { CustomerService } from '../../customer/application/customer.service';

@Injectable()
export class BalanceService {
  constructor(
    @Inject(IBalanceRepository)
    private readonly balanceRepository: IBalanceRepository,
    @Inject(CustomerService)
    private readonly customerService: CustomerService,
  ) {}

  //TODO: customer 여부 판단은 추후 guard로 처리
  async getBalance(customerId: number): Promise<Balance> {
    await this.customerService.getCustomerById(customerId);

    return await this.balanceRepository.getBalanceByUserId(customerId);
  }

  //TODO: customer 여부 판단은 추후 guard로 처리
  async chargeBalance(customerId: number, amount: number): Promise<Balance> {
    await this.customerService.getCustomerById(customerId);

    return await this.balanceRepository.chargeBalance(customerId, amount);
  }

  //TODO: customer 여부 판단은 추후 guard로 처리
  async withdrawBalance(customerId: number, amount: number): Promise<Balance> {
    await this.customerService.getCustomerById(customerId);

    return await this.balanceRepository.withdrawBalance(customerId, amount);
  }
}

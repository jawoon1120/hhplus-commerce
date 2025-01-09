import { Inject, Injectable } from '@nestjs/common';
import { IBalanceRepository } from '../domain/balance-repository.interface';
import { Balance } from '../domain/balance.domain';

@Injectable()
export class BalanceService {
  constructor(
    @Inject(IBalanceRepository)
    private readonly balanceRepository: IBalanceRepository,
  ) {}

  async getBalance(customerId: number): Promise<Balance> {
    return await this.balanceRepository.getBalanceByUserId(customerId);
  }

  async chargeBalance(customerId: number, amount: number): Promise<Balance> {
    return await this.balanceRepository.chargeBalance(customerId, amount);
  }

  async withdrawBalance(customerId: number, amount: number): Promise<Balance> {
    return await this.balanceRepository.withdrawBalance(customerId, amount);
  }
}

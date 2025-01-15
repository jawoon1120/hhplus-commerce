import { Inject, Injectable } from '@nestjs/common';
import { IBalanceRepository } from './balance-repository.interface';
import { Balance } from '../domain/balance.domain';
import { NotFoundException } from '../../../common/custom-exception/not-found.exception';

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
    const balance =
      await this.balanceRepository.getBalanceByUserIdWithLock(customerId);
    if (!balance) {
      throw new NotFoundException('Balance not found');
    }
    balance.chargeBalance(amount);
    return await this.balanceRepository.chargeBalance(balance);
  }

  async withdrawBalance(customerId: number, amount: number): Promise<Balance> {
    const balance =
      await this.balanceRepository.getBalanceByUserIdWithLock(customerId);
    if (!balance) {
      throw new NotFoundException('Balance not found');
    }
    balance.withdrawBalance(amount);
    return await this.balanceRepository.withdrawBalance(balance);
  }
}

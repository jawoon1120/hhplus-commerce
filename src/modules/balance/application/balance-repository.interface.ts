import { Balance } from '../domain/balance.domain';

export interface IBalanceRepository {
  getBalanceByUserId(customerId: number): Promise<Balance>;
  createBalance(balance: Balance): Promise<Balance>;
  chargeBalance(balance: Balance): Promise<Balance>;
  withdrawBalance(balance: Balance): Promise<Balance>;
  getBalanceByUserIdWithLock(customerId: number): Promise<Balance>;
}

export const IBalanceRepository = Symbol('IBalanceRepository');

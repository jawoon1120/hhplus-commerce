import { Balance } from '../domain/balance.domain';

export interface IBalanceRepository {
  getBalanceByUserId(customerId: number): Promise<Balance>;
  chargeBalance(customerId: number, amount: number): Promise<Balance>;
  withdrawBalance(customerId: number, amount: number): Promise<Balance>;
  getBalanceByUserIdWithLock(customerId: number): Promise<Balance>;
}

export const IBalanceRepository = Symbol('IBalanceRepository');

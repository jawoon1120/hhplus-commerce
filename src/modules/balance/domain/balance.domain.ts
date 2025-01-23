import { BadRequestException } from '../../../common/custom-exception/bad-request.exception';

export class Balance {
  id: number;
  customerId: number;
  amount: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(balance: Partial<Balance>) {
    if (balance) {
      Object.assign(this, balance);
    }
  }

  static create(balance: Partial<Balance>): Balance {
    return new Balance(balance);
  }

  getBalance(): number {
    return this.amount;
  }

  chargeBalance(amount: number): void {
    this.amount += amount;
  }

  withdrawBalance(amount: number): void {
    if (this.amount - amount < 0) {
      throw new BadRequestException('not enough balance to withdraw');
    }
    this.amount -= amount;
  }
}

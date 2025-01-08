export class Balance {
  id: number;
  customerId: number;
  amount: number;
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

  //TODO: 아래 로직들 transaction 데코레이터 구현하고 사용할 수 있도록 해야함
  //      현재는 repository에서 묶여서 구현되어 있음
  // chargeBalance(amount: number): void {
  //   this.amount += amount;
  // }

  // withdrawBalance(amount: number): void {
  //   if (this.amount - amount < 0) {
  //     throw new BadRequestException('Balance is not enough');
  //   }
  //   this.amount -= amount;
  // }
}

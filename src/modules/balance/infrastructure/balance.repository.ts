import { Injectable, NotFoundException } from '@nestjs/common';
import { IBalanceRepository } from '../domain/balance-repository.interface';
import { BalanceDataMapper } from './balance.data-mapper';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Balance as BalanceEntity, Prisma } from '@prisma/client';
import { Balance } from '../domain/balance.domain';

@Injectable()
export class BalanceRepository implements IBalanceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly balanceDataMapper: BalanceDataMapper,
  ) {}

  async getBalanceByUserId(customerId: number): Promise<Balance> {
    const balance: BalanceEntity = await this.prisma.balance.findUnique({
      where: { customerId: customerId },
    });

    return this.balanceDataMapper.toDomain(balance);
  }

  async _getBalanceByUserIdWithLock(
    tx: Prisma.TransactionClient,
    customerId: number,
  ): Promise<BalanceEntity | undefined> {
    const balances: BalanceEntity[] = await tx.$queryRaw<
      BalanceEntity[]
    >`SELECT * FROM Balance WHERE customerId = ${customerId} FOR UPDATE`;

    return balances[0];
  }

  async withdrawBalance(customerId: number, amount: number): Promise<Balance> {
    const savedBalance = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const balance = await this._getBalanceByUserIdWithLock(tx, customerId);

        if (!balance) {
          throw new NotFoundException('Balance not found');
        }
        const totalAmount = balance.amount - amount;

        const updatedBalance = await tx.balance.update({
          where: { customerId: customerId },
          data: { amount: totalAmount },
        });

        return updatedBalance;
      },
    );

    return this.balanceDataMapper.toDomain(savedBalance);
  }

  async chargeBalance(customerId: number, amount: number): Promise<Balance> {
    const savedBalance = await this.prisma.$transaction(async (tx) => {
      const balance = await this._getBalanceByUserIdWithLock(tx, customerId);

      let upsetedBalance: BalanceEntity;
      if (balance) {
        upsetedBalance = await tx.balance.update({
          where: { customerId: customerId },
          data: { amount: balance.amount + amount },
        });
      } else {
        upsetedBalance = await tx.balance.create({
          data: { customerId: customerId, amount: amount },
        });
      }

      return upsetedBalance;
    });

    return this.balanceDataMapper.toDomain(savedBalance);
  }
}

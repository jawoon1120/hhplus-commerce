import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IBalanceRepository } from '../application/balance-repository.interface';
import { BalanceDataMapper } from './balance.data-mapper';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { Balance as BalanceEntity } from '@prisma/client';
import { Balance } from '../domain/balance.domain';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class BalanceRepository implements IBalanceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly balanceDataMapper: BalanceDataMapper,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async getBalanceByUserId(customerId: number): Promise<Balance> {
    const balance: BalanceEntity = await this.prisma.balance.findUnique({
      where: { customerId: customerId },
    });

    return this.balanceDataMapper.toDomain(balance);
  }

  async getBalanceByUserIdWithLock(customerId: number): Promise<Balance> {
    const balances: BalanceEntity[] = await this.txHost.tx.$queryRaw<
      BalanceEntity[]
    >`SELECT * FROM Balance WHERE customerId = ${customerId} FOR UPDATE`;
    const balance = balances[0];
    if (!balance) {
      throw new NotFoundException('Balance not found');
    }
    return this.balanceDataMapper.toDomain(balance);
  }

  async withdrawBalance(customerId: number, amount: number): Promise<Balance> {
    const balance = await this.getBalanceByUserIdWithLock(customerId);
    if (balance.amount < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    const updatedBalance = await this.txHost.tx.balance.update({
      where: { customerId: customerId },
      data: { amount: { decrement: amount } },
    });
    await this.txHost.tx.balanceHistory.create({
      data: {
        balanceId: updatedBalance.id,
        amount: amount.toString(),
        type: 'WITHDRAW',
      },
    });

    return this.balanceDataMapper.toDomain(updatedBalance);
  }

  async chargeBalance(customerId: number, amount: number): Promise<Balance> {
    const updatedBalance = await this.txHost.tx.balance.update({
      where: { customerId: customerId },
      data: { amount: { increment: amount } },
    });

    await this.txHost.tx.balanceHistory.create({
      data: {
        balanceId: updatedBalance.id,
        amount: amount.toString(),
        type: 'CHARGE',
      },
    });

    return this.balanceDataMapper.toDomain(updatedBalance);
  }
}

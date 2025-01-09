import { Injectable } from '@nestjs/common';
import { Balance as BalanceEntity } from '@prisma/client';
import { Balance } from '../domain/balance.domain';
import { DataMapper } from '../../../infrastructure/data-mapper';

@Injectable()
export class BalanceDataMapper extends DataMapper<Balance, BalanceEntity> {
  toDomain(balance: BalanceEntity): Balance {
    if (!balance) {
      return null;
    }
    return Balance.create(balance);
  }

  toEntity(balance: Balance): BalanceEntity {
    if (!balance) {
      return null;
    }
    return {
      id: balance.id,
      customerId: balance.customerId,
      amount: balance.amount,
      createdAt: balance.createdAt,
      updatedAt: balance.updatedAt,
      deletedAt: balance.deletedAt,
    };
  }
}

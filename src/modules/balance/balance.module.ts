import { Module } from '@nestjs/common';
import { BalanceController } from './interface/balance.controller';
import { BalanceService } from './balance.service';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService]
})
export class BalanceModule {}

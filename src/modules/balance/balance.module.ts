import { Module } from '@nestjs/common';
import { BalanceController } from './presentation/balance.controller';
import { BalanceService } from './application/balance.service';
import { BalanceDataMapper } from './infrastructure/balance.data-mapper';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { IBalanceRepository } from './application/balance-repository.interface';
import { BalanceRepository } from './infrastructure/balance.repository';
import { CustomerModule } from '../customer/customer.module';
import { BalanceFacade } from './application/balance.facade';

@Module({
  imports: [PrismaModule, CustomerModule],
  controllers: [BalanceController],
  providers: [
    BalanceService,
    BalanceDataMapper,
    {
      provide: IBalanceRepository,
      useClass: BalanceRepository,
    },
    BalanceFacade,
  ],
  exports: [BalanceService],
})
export class BalanceModule {}

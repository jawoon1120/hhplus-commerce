import { Module } from '@nestjs/common';
import { BuyerService } from './application/buyer.service';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { BuyerRepository } from './infrastructure/buyer.repository';
import { IBuyerRepository } from './application/buyer-repository.interface';

@Module({
  imports: [PrismaModule],
  providers: [
    BuyerService,
    {
      provide: IBuyerRepository,
      useClass: BuyerRepository,
    },
  ],
  exports: [BuyerService],
})
export class BuyerModule {}

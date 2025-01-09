import { Module } from '@nestjs/common';
import { PaymentFacade } from './application/payment.facade';
import { PaymentController } from './presentation/payment.controller';
import { PgModule } from '../../pg/pg.module';

import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { PaymentService } from './application/payment.service';
import { PaymentDataMapper } from './infrastructure/payment.data-mapper';
import { IPaymentRepository } from './application/payment-repository.interface';
import { PaymentRepository } from './infrastructure/payment.repository';
import { CouponModule } from '../coupon/coupon.module';
import { CustomerModule } from '../customer/customer.module';
import { BalanceModule } from '../balance/balance.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    PgModule,
    PrismaModule,
    CouponModule,
    CustomerModule,
    OrderModule,
    BalanceModule,
  ],
  controllers: [PaymentController],
  providers: [
    PaymentFacade,
    PaymentService,
    PaymentDataMapper,
    { provide: IPaymentRepository, useClass: PaymentRepository },
  ],
})
export class PaymentModule {}

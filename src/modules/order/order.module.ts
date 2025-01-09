import { Module } from '@nestjs/common';
import { OrderController } from './presentation/order.controller';
import { OrderService } from './application/order.service';
import { OrderFacade } from './application/order.facade';
import { ProductModule } from '../product/product.module';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { CustomerModule } from '../customer/customer.module';
import { OrderDataMapper } from './infrastructure/order.data-mapper';
import { OrderDetailDataMapper } from './infrastructure/order-detail.data-mapper';
import { OrderRepository } from './infrastructure/order.repository';
import { IOrderRepository } from './application/order-repository.interface';
@Module({
  imports: [ProductModule, PrismaModule, CustomerModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderFacade,
    OrderDataMapper,
    OrderDetailDataMapper,
    {
      provide: IOrderRepository,
      useClass: OrderRepository,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}

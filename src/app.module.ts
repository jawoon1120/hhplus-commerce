import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CouponModule } from './modules/coupon/coupon.module';
import { BalanceModule } from './modules/balance/balance.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './configs/configs.service';
import { PrismaModule } from './infrastructure/database/prisma.module';

const serviceModules = [
  CouponModule,
  BalanceModule,
  ProductModule,
  OrderModule,
  PaymentModule,
];
@Module({
  imports: [
    ...serviceModules,
    ConfigModule.forRoot(AppConfigService.getEnvConfigs()),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

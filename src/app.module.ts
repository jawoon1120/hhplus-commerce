import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CouponModule } from './modules/coupon/coupon.module';
import { BalanceModule } from './balance/balance.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [CouponModule, BalanceModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

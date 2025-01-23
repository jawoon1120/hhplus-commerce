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
import { CustomerModule } from './modules/customer/customer.module';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from './infrastructure/database/prisma.service';
import { PgModule } from './pg/pg.module';
import { RedisModule } from '@nestjs-modules/ioredis';

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
    CustomerModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [
            // module in which the PrismaClient is provided
            PrismaModule,
          ],
          adapter: new TransactionalAdapterPrisma({
            // the injection token of the PrismaClient
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
      global: true,
      middleware: { mount: true },
    }),
    PgModule,
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: 'redis://localhost:6379',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { CouponController } from './presentation/coupon.controller';
import { CouponService } from './application/coupon.service';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { IssuedCouponDataMapper } from './infrastructure/issued-coupon.data-mapper';
import { CouponDataMapper } from './infrastructure/coupon.data-mapper';
import { IssuedCouponRepository } from './infrastructure/issued-coupon.respository';
import { IIssuedCouponRepository } from './application/issued-coupon-repository.interface';
import { CouponRepository } from './infrastructure/coupon.respository';
import { ICouponRepository } from './application/coupon-repository.interface';
import { IoRedisModule } from '../../infrastructure/redis/redis.module';

@Module({
  controllers: [CouponController],
  providers: [
    CouponService,
    IssuedCouponDataMapper,
    CouponDataMapper,
    {
      provide: IIssuedCouponRepository,
      useClass: IssuedCouponRepository,
    },
    {
      provide: ICouponRepository,
      useClass: CouponRepository,
    },
  ],
  imports: [PrismaModule, IoRedisModule],
  exports: [CouponService, IssuedCouponDataMapper],
})
export class CouponModule {}

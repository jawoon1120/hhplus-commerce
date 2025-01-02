import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CouponQueryDto } from './dto/coupon-query.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CouponIssueRequestDto } from './dto/coupon-issue.dto';
import { OwnedCouponQueryDto } from './dto/owned-coupon-query.dto';

@Controller('coupons')
export class CouponController {
  @Get()
  @ApiOperation({
    summary: '쿠폰 조회',
    description: '쿠폰을 조회합니다.',
  })
  @ApiOkResponse({
    description: '쿠폰 조회 성공',
    type: [CouponQueryDto],
  })
  getCoupons(): CouponQueryDto[] {
    const mockCoupons: CouponQueryDto[] = [
      {
        id: 1,
        discountAmount: 10000,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        remainingQuantity: 50,
      },
      {
        id: 2,
        discountAmount: 20000,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        remainingQuantity: 100,
      },
    ];
    return mockCoupons;
  }

  @Post()
  @ApiOperation({
    summary: '쿠폰 발급',
    description: '쿠폰을 발급합니다.',
  })
  @ApiCreatedResponse({
    description: '쿠폰 발급 성공',
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  issueCoupon(@Body() issueDto: CouponIssueRequestDto): Promise<void> {
    return;
  }

  @Get('/users/:userId')
  @ApiOperation({
    summary: '사용자 보유 쿠폰 조회',
    description: '사용자가 보유한 쿠폰을 조회합니다.',
  })
  @ApiOkResponse({
    description: '사용자 보유 쿠폰 조회 성공',
    type: [OwnedCouponQueryDto],
  })
  getUserOwnedCoupons(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('userId') userId: number,
  ): OwnedCouponQueryDto[] {
    const mockOwnedCoupons: OwnedCouponQueryDto[] = [
      {
        id: 1,
        discountAmount: 10000,
        expirationDate: '2025-12-31',
      },
      {
        id: 2,
        discountAmount: 20000,
        expirationDate: '2025-12-31',
      },
    ];
    return mockOwnedCoupons;
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CouponQueryDto } from './dto/coupon-query.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CouponIssueRequestDto,
  CouponIssueResponseDto,
} from './dto/coupon-issue.dto';
import { OwnedCouponQueryDto } from './dto/owned-coupon-query.dto';
import { CouponService } from '../application/coupon.service';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @ApiOperation({
    summary: '쿠폰 조회',
    description: '쿠폰을 조회합니다.',
  })
  @ApiOkResponse({
    description: '쿠폰 조회 성공',
    type: [CouponQueryDto],
  })
  async getCoupons(): Promise<CouponQueryDto[]> {
    const coupons = await this.couponService.getCoupons();
    return coupons.map((coupon) => CouponQueryDto.create(coupon));
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
  async issueCoupon(
    @Body() issueDto: CouponIssueRequestDto,
  ): Promise<CouponIssueResponseDto> {
    const issuedCoupon = await this.couponService.issueCoupon(
      issueDto.customerId,
      issueDto.couponId,
    );
    return { issuedCouponId: issuedCoupon.id };
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
  async getUserOwnedCoupons(
    @Param('userId') userId: number,
  ): Promise<OwnedCouponQueryDto[]> {
    const ownedCoupons = await this.couponService.getOwnedCoupons(userId);
    return ownedCoupons.map((ownedCoupon) =>
      OwnedCouponQueryDto.create(ownedCoupon),
    );
  }
}

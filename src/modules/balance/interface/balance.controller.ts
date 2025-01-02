import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChargeBalanceRequestDto } from './dto/balance-charge.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { QueryBalanceResponseDto } from './dto/balance-query.dto';

@Controller('/users/:userId/balances')
export class BalanceController {
  // 잔책 충전 API 엔드포인트
  @Post()
  @ApiOperation({
    summary: '잔액 충전',
    description: '사용자가 잔액을 충전합니다.',
  })
  @ApiCreatedResponse({
    description: '잔액 충전 성공',
  })
  chargeBalance(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() chargeDto: ChargeBalanceRequestDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('userId') userId: number,
  ): Promise<void> {
    return;
  }

  // 잔책 조회 API 엔드포인트
  @Get()
  @ApiOperation({
    summary: '잔액 조회',
    description: '사용자가 잔액을 조회합니다.',
  })
  @ApiOkResponse({
    type: QueryBalanceResponseDto,
    description: '잔액 조회 성공',
  })
  checkBalance(): QueryBalanceResponseDto {
    const mockBalance = {
      amount: 10000,
    };
    return mockBalance;
  }
}

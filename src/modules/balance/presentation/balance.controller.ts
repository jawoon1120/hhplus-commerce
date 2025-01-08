import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChargeBalanceRequestDto } from './dto/balance-charge.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { QueryBalanceResponseDto } from './dto/balance-query.dto';
import { BalanceService } from '../application/balance.service';
import { Balance } from '../domain/balance.domain';

@Controller('/users/:customerId/balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  // 잔책 충전 API 엔드포인트
  @Post()
  @ApiOperation({
    summary: '잔액 충전',
    description: '사용자가 잔액을 충전합니다.',
  })
  @ApiCreatedResponse({
    description: '잔액 충전 성공',
  })
  async chargeBalance(
    @Body() chargeDto: ChargeBalanceRequestDto,
    @Param('customerId') customerId: number,
  ): Promise<QueryBalanceResponseDto> {
    const balance = await this.balanceService.chargeBalance(
      customerId,
      chargeDto.amount,
    );

    return {
      amount: balance.amount,
      customerId: balance.customerId,
    };
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
  async checkBalance(
    @Param('customerId') customerId: number,
  ): Promise<QueryBalanceResponseDto> {
    const balance: Balance = await this.balanceService.getBalance(customerId);
    return {
      amount: balance.amount,
      customerId: balance.customerId,
    };
  }
}

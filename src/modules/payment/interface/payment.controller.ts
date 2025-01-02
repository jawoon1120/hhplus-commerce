import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  PaymentCreateRequestDto,
  PaymentCreateResponseDto,
} from './dto/payment-create.dto';
import { PaymentInfoDto, PaymentInfoResponseDto } from './dto/payment-info.dto';

@Controller('payment')
export class PaymentController {
  @Get(':orderId')
  @ApiOperation({ summary: '주문의 결제 정보 조회' })
  @ApiOkResponse({
    description: '주문의 결제 정보 조회 성공',
    type: PaymentInfoResponseDto,
  })
  getPaymentInfoByOrderId(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('orderId') orderId: number,
  ): PaymentInfoResponseDto {
    const paymentInfos: PaymentInfoDto[] = [
      new PaymentInfoDto({ productId: 1, quantity: 1, combinedPrice: 10000 }),
      new PaymentInfoDto({ productId: 2, quantity: 2, combinedPrice: 20000 }),
    ];

    return new PaymentInfoResponseDto(paymentInfos, 30000);
  }

  @Post()
  @ApiOperation({ summary: '결제 생성' })
  @ApiCreatedResponse({
    description: '결제 생성 성공',
    type: PaymentCreateResponseDto,
  })
  createPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() paymentCreateDto: PaymentCreateRequestDto,
  ): PaymentCreateResponseDto {
    return { paymentId: 1 };
  }
}

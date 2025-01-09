import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import {
  PaymentCreateRequestDto,
  PaymentCreateResponseDto,
} from './dto/payment-create.dto';
import { PaymentFacade } from '../application/payment.facade';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentFacade: PaymentFacade) {}
  @Post()
  @ApiOperation({ summary: '결제 생성' })
  @ApiCreatedResponse({
    description: '결제 생성 성공',
    type: PaymentCreateResponseDto,
  })
  async createPayment(
    @Body() paymentCreateDto: PaymentCreateRequestDto,
  ): Promise<PaymentCreateResponseDto> {
    const { orderId, customerId, issuedCouponId } = paymentCreateDto;
    const payment = await this.paymentFacade.makePayment(
      orderId,
      customerId,
      issuedCouponId,
    );
    return { paymentId: payment.id };
  }
}

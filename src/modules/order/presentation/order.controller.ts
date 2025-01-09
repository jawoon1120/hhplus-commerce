import { Body, Controller, Post } from '@nestjs/common';
import {
  OrderCreateRequestDto,
  OrderCreateResponseDto,
} from './dto/order-create.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { OrderFacade } from '../application/order.facade';

@Controller('order')
export class OrderController {
  constructor(private readonly orderFacade: OrderFacade) {}

  @Post()
  @ApiOperation({ summary: '주문 생성' })
  @ApiCreatedResponse({
    description: '주문 생성 성공',
    type: OrderCreateResponseDto,
  })
  async placeOrder(
    @Body() orderCreateDto: OrderCreateRequestDto,
  ): Promise<OrderCreateResponseDto> {
    const order = await this.orderFacade.createOrder(orderCreateDto);
    return {
      orderId: order.id,
      totalPrice: order.totalPrice,
      orderDetails: order.orderDetails,
    };
  }
}

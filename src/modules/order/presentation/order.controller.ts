import { Body, Controller, Post } from '@nestjs/common';
import {
  OrderCreateRequestDto,
  OrderCreateResponseDto,
} from './dto/order-create.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { OrderService } from '../application/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: '주문 생성' })
  @ApiCreatedResponse({
    description: '주문 생성 성공',
    type: OrderCreateResponseDto,
  })
  createOrder(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() orderCreateDto: OrderCreateRequestDto,
  ): OrderCreateResponseDto {
    return { orderId: 1 };
  }
}

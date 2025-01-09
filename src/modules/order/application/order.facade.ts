import { Injectable } from '@nestjs/common';
import { OrderService } from './order.service';
import { ProductService } from '../../product/application/product.service';
import { Transactional } from '@nestjs-cls/transactional';
import { OrderCreateRequestDto } from '../presentation/dto/order-create.dto';
import { CustomerService } from '../../customer/application/customer.service';
import { Order } from '../domain/order.domain';

@Injectable()
export class OrderFacade {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
  ) {}

  // #1Test user 없을 경우,
  // #2Test product 없을 경우,
  // #3Test product 재고 부족 경우,
  // #4Test 정상 경우
  @Transactional()
  async createOrder(orderCreateDto: OrderCreateRequestDto) {
    const productDtos = orderCreateDto.products.map((product) => ({
      id: product.productId,
      consumeStockAmount: product.quantity,
    }));
    await this.customerService.getCustomerById(orderCreateDto.customerId);

    const products = await this.productService.consumeStockList(productDtos);
    const order: Order = await this.orderService.createOrder(
      orderCreateDto,
      products,
    );

    return order;
  }
}

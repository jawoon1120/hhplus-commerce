import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBuyerRepository } from './buyer-repository.interface';
import { Buyer } from '@prisma/client';

@Injectable()
export class BuyerService {
  constructor(
    @Inject(IBuyerRepository)
    private readonly buyerRepository: IBuyerRepository,
  ) {}

  async getBuyerById(id: number): Promise<Buyer> {
    const buyer = await this.buyerRepository.findById(id);

    if (!buyer) {
      throw new NotFoundException('Buyer not found');
    }

    return buyer;
  }
}

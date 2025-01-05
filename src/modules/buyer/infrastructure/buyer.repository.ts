import { Injectable } from '@nestjs/common';
import { IBuyerRepository } from '../application/buyer-repository.interface';

import { Buyer } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class BuyerRepository implements IBuyerRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: number): Promise<Buyer> {
    return await this.prisma.buyer.findUnique({
      where: {
        id,
      },
    });
  }
}

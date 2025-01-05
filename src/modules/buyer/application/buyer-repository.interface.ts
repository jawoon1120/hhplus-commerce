import { Buyer } from '@prisma/client';

export interface IBuyerRepository {
  findById(id: number): Promise<Buyer>;
}

export const IBuyerRepository = Symbol('IBuyerRepository');

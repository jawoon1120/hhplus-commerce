import { Product } from '@prisma/client';

export interface PopularProduct extends Product {
  totalQuantity: number;
}

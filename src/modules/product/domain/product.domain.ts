export class Product {
  id: number;
  name: string;
  price: number;
  sellerId: number;
  totalQuantity: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(product: Partial<Product>) {
    Object.assign(this, product);
  }

  static create(product: Partial<Product>): Product {
    return new Product(product);
  }

  consumeStock(consumeStockAmount: number): void {
    if (this.stock < consumeStockAmount) {
      throw new Error('재고가 부족합니다');
    }
    this.stock = this.stock - consumeStockAmount;
  }
}

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
}

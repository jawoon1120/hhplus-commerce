export class Customer {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(customer: Partial<Customer>) {
    if (customer) {
      Object.assign(this, customer);
    }
  }

  static create(customer: Partial<Customer>): Customer {
    return new Customer(customer);
  }
}

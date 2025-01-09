import { Injectable } from '@nestjs/common';

@Injectable()
export class PgService {
  requestPayment(paymentId: number): boolean {
    console.log(`requestPayment: ${paymentId} .... SUCCESS!!`);
    return true;
  }
}

import { Payment, PaymentStatus } from '../domain/payment.domain';

export interface IPaymentRepository {
  createPayment(payment: Payment): Promise<Payment>;
  updatePaymentStatus(
    paymentId: number,
    status: PaymentStatus,
  ): Promise<Payment>;
}

export const IPaymentRepository = Symbol('IPaymentRepository');

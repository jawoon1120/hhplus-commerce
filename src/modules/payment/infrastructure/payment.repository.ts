import { Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from '../domain/payment.domain';
import { IPaymentRepository } from '../application/payment-repository.interface';
import { PaymentDataMapper } from './payment.data-mapper';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    private readonly paymentDataMapper: PaymentDataMapper,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}
  async createPayment(payment: Payment): Promise<Payment> {
    const paymentEntity = this.paymentDataMapper.toEntity(payment);

    const createdPaymentEntity = await this.txHost.tx.payment.create({
      data: { ...paymentEntity },
    });

    return this.paymentDataMapper.toDomain(createdPaymentEntity);
  }

  async updatePaymentStatus(
    paymentId: number,
    status: PaymentStatus,
  ): Promise<Payment> {
    const updatedPaymentEntity = await this.txHost.tx.payment.update({
      where: { id: paymentId },
      data: { status },
    });
    return this.paymentDataMapper.toDomain(updatedPaymentEntity);
  }
}

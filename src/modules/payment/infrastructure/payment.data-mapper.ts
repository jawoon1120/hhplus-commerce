import { Injectable } from '@nestjs/common';
import { Payment as PaymentEntity } from '@prisma/client';
import { Payment, PaymentStatus } from '../domain/payment.domain';
import { DataMapper } from '../../../infrastructure/data-mapper';

@Injectable()
export class PaymentDataMapper extends DataMapper<Payment, PaymentEntity> {
  toDomain(paymentEntity: PaymentEntity): Payment {
    if (!paymentEntity) {
      return null;
    }
    return Payment.create({
      id: paymentEntity.id,
      orderId: paymentEntity.orderId,
      issuedCouponId: paymentEntity.issuedCouponId,
      status: paymentEntity.status as PaymentStatus,
      originPrice: paymentEntity.originPrice,
      discountedPrice: paymentEntity.discountedPrice,
      finalPrice: paymentEntity.finalPrice,
      createdAt: paymentEntity.createdAt,
      updatedAt: paymentEntity.updatedAt,
      deletedAt: paymentEntity.deletedAt,
    });
  }

  toEntity(payment: Payment): PaymentEntity {
    if (!payment) {
      return null;
    }
    return {
      id: payment.id,
      orderId: payment.orderId,
      issuedCouponId: payment.issuedCouponId,
      status: payment.status,
      originPrice: payment.originPrice,
      discountedPrice: payment.discountedPrice,
      finalPrice: payment.finalPrice,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      deletedAt: payment.deletedAt,
    };
  }
}

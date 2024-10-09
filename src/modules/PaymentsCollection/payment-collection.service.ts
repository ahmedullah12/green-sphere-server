import { initiatePayment } from '../Payment/payment.utils';
import { Payment } from './payment-collection.model';

const createPayment = async (payload: string) => {
  const payment = await Payment.create(payload);

  const transactionId = `TXN-RR-${Date.now()}`;

  const paymentData = {
    transactionId,
    userId: payment.userId,
    totalAmount: payment?.totalAmount,
    customerName: payment?.name,
    customerEmail: payment?.email,
    customerPhone: payment?.phone,
    customerAddress: payment?.address,
  };

  const paymentSession = await initiatePayment(paymentData);

  return paymentSession;
};

export const PaymentCollectionService = {
    createPayment,
}
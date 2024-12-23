import { initiatePayment } from '../Payment/payment.utils';
import { Payment } from './payment-collection.model';

const createPayment = async (payload: string) => {
  const payment = await Payment.create(payload);

  const transactionId = `TXN-RR-${Date.now()}`;

  const paymentData = {
    transactionId,
    userId: payment.userId,
    paymentId: payment._id,
    totalAmount: payment?.totalAmount,
    customerName: payment?.name,
    customerEmail: payment?.email,
    customerPhone: payment?.phone,
    customerAddress: payment?.address,

  };

  const paymentSession = await initiatePayment(paymentData);

  return paymentSession;
};

const getPayments = async () => {
  const payments = await Payment.find().populate("userId");

  return payments;
};

export const PaymentCollectionService = {
  createPayment,
  getPayments,
};

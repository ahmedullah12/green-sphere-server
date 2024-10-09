/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { join } from 'path';
import { readFileSync } from 'fs';
import { verifyPayment } from './payment.utils';
import { User } from '../User/user.model';
import { Payment } from '../PaymentsCollection/payment-collection.model';

const confirmationService = async (transactionId: string, userId: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  let result;
  let message = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    result = await User.findOneAndUpdate(
      { _id: userId },
      { isVerified: true },
      { new: true },
    );

    await Payment.findOneAndUpdate(
      { userId: userId },
      { isConfirmed: true },
      { new: true },
    );
    message = 'Successfully Paid!!!';
  } else {
    message = 'Payment Failed!!!';
  }

  const filePath = join(__dirname, '../../../public/confirmation.html');
  let template = readFileSync(filePath, 'utf-8');

  // Replace placeholders with actual data
  template = template.replace('{{message}}', message);
  template = template.replace('{{bookingId}}', userId);

  return template;
};

export const PaymentServices = {
  confirmationService,
};

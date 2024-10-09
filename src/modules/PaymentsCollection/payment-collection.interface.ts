import { Types } from 'mongoose';

export type TPayment = {
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: number;
  isConfirmed: boolean;
};

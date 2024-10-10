import { model, Schema } from 'mongoose';
import { TPayment } from './payment-collection.interface';

const paymentSchema = new Schema<TPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  totalAmount: { type: Number, default: 500, },
  isConfirmed: {type: Boolean, default: false},
}, {
  timestamps: true,
});

export const Payment = model<TPayment>('Payment', paymentSchema);

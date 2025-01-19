import { Types } from 'mongoose';
import { NOTIFICATION_TYPE } from './notification.constant';

export interface INotification {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: keyof typeof NOTIFICATION_TYPE;
  post?: Types.ObjectId;
  comment?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

import { Schema, model } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['upvote', 'downvote', 'follow', 'unfollow', 'comment'],
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: function () {
        return ['upvote', 'downvote', 'comment'].includes(this.type);
      },
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: function () {
        return this.type === 'comment';
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Notification = model('Notification', notificationSchema);

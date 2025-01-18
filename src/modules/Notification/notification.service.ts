// notification.service.ts
import { JwtPayload } from 'jsonwebtoken';
import { Notification } from './notification.model';
import { io } from '../../server';

const NotificationService = {
  async createNotification(data: {
    recipient: string;
    sender: string;
    type: string;
    post?: string;
  }) {
    const notification = await Notification.create(data);
    await notification.populate(['recipient', 'sender', 'post']);
    
    // Emit to specific recipient
    io.to(data.recipient).emit('notification', notification);
    
    return notification;
  },

  async deleteNotification(query: {
    recipient: string;
    sender: string;
    type: string;
    post?: string;
  }) {
    const notification = await Notification.findOneAndDelete(query);
    
    if (notification) {
      io.to(query.recipient).emit('deleteNotification', notification._id);
    }
    
    return notification;
  },

  async getNotifications(userId: string) {
    const notifications = await Notification.find({
      recipient: userId
    })
    .sort({ createdAt: -1 })  // Sort by newest first
    .populate(['recipient', 'sender', 'post']);

    return notifications;
  }
};

export default NotificationService;
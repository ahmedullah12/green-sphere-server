import { Notification } from './notification.model';
import { Server } from 'socket.io';

class NotificationService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async createNotification(data: {
    recipient: string;
    sender: string;
    type: string;
    post?: string;
  }) {
    const notification = await Notification.create(data);
    await notification.populate(['recipient', 'sender', 'post']);
    
    // Emit to specific recipient
    this.io.to(data.recipient).emit('notification', notification);
    
    return notification;
  }

  async deleteNotification(query: {
    recipient: string;
    sender: string;
    type: string;
    post?: string;
  }) {
    const notification = await Notification.findOneAndDelete(query);
    
    if (notification) {
      this.io.to(query.recipient).emit('deleteNotification', notification._id);
    }
    
    return notification;
  }
};

export default NotificationService;
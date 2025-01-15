import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { Server } from 'http';
import { Server as SocketIoServer } from 'socket.io';

let server: Server;
let io: SocketIoServer;

async function main() {
  try {
    await mongoose.connect(config.db_url as string);

    server = app.listen(config.port, () => {
      console.log(`Server running on  ${config.port}`);
    });

    io = new SocketIoServer(server, {
      cors: {
        origin: ['http://localhost:3000', 'https://greensphere.netlify.app'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log(`User connected ${socket.id}`);

      // Join a room with the user's ID for private notifications
      socket.on('join', (userId: string) => {
        socket.join(userId);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

export { io };

main();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.log(`unhandledRejection is detected, shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', () => {
  console.log(`uncaughtException is detected, shutting down ...`);
  process.exit(1);
});

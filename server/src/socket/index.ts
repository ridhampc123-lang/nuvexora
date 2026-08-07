import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

let io: Server | null = null;

export const initSocketIO = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on("join_project_room", (projectId: string) => {
      socket.join(`project_${projectId}`);
      console.log(`[Socket.IO] Socket ${socket.id} joined project room: project_${projectId}`);
    });

    socket.on("join_channel", (channelId: string) => {
      socket.join(channelId);
      console.log(`[Socket.IO] Socket ${socket.id} joined chat channel: ${channelId}`);
    });

    socket.on("leave_channel", (channelId: string) => {
      socket.leave(channelId);
      console.log(`[Socket.IO] Socket ${socket.id} left chat channel: ${channelId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("[Socket.IO Error] Socket.IO has not been initialized!");
  }
  return io;
};

export const broadcastEvent = (event: string, payload?: any) => {
  if (io) {
    io.emit(event, payload || { timestamp: new Date().toISOString() });
    io.emit("dashboard_update", { event, timestamp: new Date().toISOString() });
  }
};


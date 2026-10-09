import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

let io: Server | null = null;

export const initSocketIO = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL] : false,
      credentials: true,
    },
  });

  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error"));

      const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
      const decoded = jwt.verify(token, secret) as any;
      const user = await User.findById(decoded.userId).select("role status");
      
      if (!user || user.status !== "active") return next(new Error("Authentication error"));
      
      socket.user = { userId: decoded.userId, role: user.role };
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: any) => {
    console.log(`[Socket.IO] Authenticated client connected: ${socket.id}`);

    socket.on("join_project_room", (projectId: string) => {
      // In a real app we'd verify the user has access to this project, 
      // but for now we rely on the fact that only authenticated users can join
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


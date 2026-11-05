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
    console.log(`[Socket.IO] Authenticated client connected: ${socket.id} (User: ${socket.user?.userId}, Role: ${socket.user?.role})`);

    // Automatically join administrative room for authorized operators
    if (socket.user?.role === "SUPER_ADMIN" || socket.user?.role === "ADMIN") {
      socket.join("admin_room");
    }

    // Join user's personal private room for direct notifications
    if (socket.user?.userId) {
      socket.join(`user_${socket.user.userId}`);
    }

    socket.on("join_project_room", async (projectId: string) => {
      try {
        if (!projectId) return;

        // Admins have wildcard observation rights
        if (socket.user?.role === "SUPER_ADMIN" || socket.user?.role === "ADMIN") {
          socket.join(`project_${projectId}`);
          return;
        }

        // Verify project authorization for clients and employees
        const { Project } = await import("../models/project.model.js");
        const project = await Project.findById(projectId);
        if (!project) return;

        const userId = socket.user?.userId;
        let isAuthorized = false;

        if (socket.user?.role === "CLIENT") {
          const { ClientAccount } = await import("../models/client.model.js");
          const client = await ClientAccount.findOne({ userId });
          if (client && (project.clientId.toString() === client._id.toString() || project.clientId.toString() === userId)) {
            isAuthorized = true;
          }
        } else if (socket.user?.role === "EMPLOYEE") {
          const { Employee } = await import("../models/employee.model.js");
          const employee = await Employee.findOne({ userId });
          if (employee && employee.assignedProjects?.some(p => p.toString() === projectId)) {
            isAuthorized = true;
          }
        }

        if (isAuthorized) {
          socket.join(`project_${projectId}`);
          console.log(`[Socket.IO] Socket ${socket.id} verified and joined project room: project_${projectId}`);
        } else {
          console.warn(`[Socket.IO Security] Denied unauthorized room join attempt: user ${userId} to project_${projectId}`);
        }
      } catch (err) {
        console.error("[Socket.IO Room Error]", err);
      }
    });

    socket.on("join_channel", (channelId: string) => {
      // Validate channel access before joining
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


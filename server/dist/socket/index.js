"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastEvent = exports.getIO = exports.initSocketIO = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_js_1 = require("../models/user.model.js");
let io = null;
const initSocketIO = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL] : false,
            credentials: true,
        },
    });
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token)
                return next(new Error("Authentication error"));
            const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const user = await user_model_js_1.User.findById(decoded.userId).select("role status");
            if (!user || user.status !== "active")
                return next(new Error("Authentication error"));
            socket.user = { userId: decoded.userId, role: user.role };
            next();
        }
        catch (err) {
            next(new Error("Authentication error"));
        }
    });
    io.on("connection", (socket) => {
        console.log(`[Socket.IO] Authenticated client connected: ${socket.id}`);
        socket.on("join_project_room", (projectId) => {
            // In a real app we'd verify the user has access to this project, 
            // but for now we rely on the fact that only authenticated users can join
            socket.join(`project_${projectId}`);
            console.log(`[Socket.IO] Socket ${socket.id} joined project room: project_${projectId}`);
        });
        socket.on("join_channel", (channelId) => {
            socket.join(channelId);
            console.log(`[Socket.IO] Socket ${socket.id} joined chat channel: ${channelId}`);
        });
        socket.on("leave_channel", (channelId) => {
            socket.leave(channelId);
            console.log(`[Socket.IO] Socket ${socket.id} left chat channel: ${channelId}`);
        });
        socket.on("disconnect", () => {
            console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocketIO = initSocketIO;
const getIO = () => {
    if (!io) {
        throw new Error("[Socket.IO Error] Socket.IO has not been initialized!");
    }
    return io;
};
exports.getIO = getIO;
const broadcastEvent = (event, payload) => {
    if (io) {
        io.emit(event, payload || { timestamp: new Date().toISOString() });
        io.emit("dashboard_update", { event, timestamp: new Date().toISOString() });
    }
};
exports.broadcastEvent = broadcastEvent;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocketIO = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initSocketIO = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log(`[Socket.IO] Client connected: ${socket.id}`);
        socket.on("join_project_room", (projectId) => {
            socket.join(`project_${projectId}`);
            console.log(`[Socket.IO] Socket ${socket.id} joined project room: project_${projectId}`);
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purgeDummyMessages = exports.getAssignedTeamMembers = exports.getChatChannels = exports.sendChatMessage = exports.getChannelMessages = void 0;
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
const chat_message_model_js_1 = require("../models/chat-message.model.js");
const index_js_1 = require("../socket/index.js");
// GET /api/v1/chat/messages?channelId=...
exports.getChannelMessages = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const channelId = req.query.channelId || "general";
    // Fetch real messages from database
    const messages = await chat_message_model_js_1.ChatMessage.find({ channelId }).sort({ createdAt: 1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, messages, "Chat messages retrieved successfully"));
});
// POST /api/v1/chat/messages
exports.sendChatMessage = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { channelId, senderId, senderName, senderRole, text, attachmentName, attachmentUrl } = req.body;
    if (!channelId || !senderName || !text) {
        throw new api_error_js_1.ApiError(400, "channelId, senderName, and text are required");
    }
    const newMessage = await chat_message_model_js_1.ChatMessage.create({
        channelId,
        senderId,
        senderName,
        senderRole: senderRole || "User",
        text,
        attachmentName,
        attachmentUrl,
    });
    // Broadcast real-time socket event
    try {
        const io = (0, index_js_1.getIO)();
        io.to(channelId).emit("new_chat_message", newMessage);
        io.emit("admin_chat_broadcast", newMessage);
    }
    catch (err) {
        console.warn("[Socket.IO Warning] Could not broadcast socket message:", err);
    }
    return res.status(201).json(new api_response_js_1.ApiResponse(201, newMessage, "Message sent successfully"));
});
// GET /api/v1/chat/channels
exports.getChatChannels = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const { Employee } = await import("../models/employee.model.js");
    const { User } = await import("../models/user.model.js");
    const [dbChannels, employees, users] = await Promise.all([
        chat_message_model_js_1.ChatMessage.aggregate([
            {
                $group: {
                    _id: "$channelId",
                    totalMessages: { $sum: 1 },
                    lastMessage: { $last: "$text" },
                    lastSender: { $last: "$senderName" },
                    updatedAt: { $max: "$createdAt" },
                },
            },
            { $sort: { updatedAt: -1 } },
        ]),
        Employee.find({ status: "active" }),
        User.find({ role: { $ne: "CLIENT" } }).select("-password"),
    ]);
    const map = new Map();
    dbChannels.forEach((c) => map.set(c._id, c));
    const result = [];
    // Add Employee Channels
    employees.forEach((emp) => {
        const channelId = `chat-emp-${emp._id}`;
        const existing = map.get(channelId);
        result.push({
            channelId,
            name: `${emp.name} (${emp.designation || emp.role || "Employee"})`,
            type: "Employee",
            totalMessages: existing ? existing.totalMessages : 0,
            lastMessage: existing ? existing.lastMessage : "No messages yet",
            lastSender: existing ? existing.lastSender : "None",
            updatedAt: existing ? existing.updatedAt : new Date().toISOString(),
        });
    });
    // Add Non-Client User Channels
    users.forEach((usr) => {
        const channelId = `chat-usr-${usr._id}`;
        const alreadyInList = result.some((r) => r.channelId === channelId);
        if (!alreadyInList) {
            const existing = map.get(channelId);
            result.push({
                channelId,
                name: `${usr.name} (${usr.role === "SUPER_ADMIN" ? "Super Admin" : usr.role})`,
                type: usr.role === "SUPER_ADMIN" ? "Admin" : "Staff",
                totalMessages: existing ? existing.totalMessages : 0,
                lastMessage: existing ? existing.lastMessage : "No messages yet",
                lastSender: existing ? existing.lastSender : "None",
                updatedAt: existing ? existing.updatedAt : new Date().toISOString(),
            });
        }
    });
    // Include any other active DB channels (e.g. group channels)
    dbChannels.forEach((c) => {
        const exists = result.some((r) => r.channelId === c._id);
        if (!exists) {
            result.push({
                channelId: c._id,
                name: c._id,
                type: "Channel",
                totalMessages: c.totalMessages,
                lastMessage: c.lastMessage,
                lastSender: c.lastSender,
                updatedAt: c.updatedAt,
            });
        }
    });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, result, "Chat channels retrieved successfully"));
});
// GET /api/v1/chat/team-members
exports.getAssignedTeamMembers = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const { Employee } = await import("../models/employee.model.js");
    const { User } = await import("../models/user.model.js");
    const employees = await Employee.find({ status: "active" });
    const users = await User.find({ role: { $ne: "CLIENT" } }).select("-password");
    const list = [];
    // 1. Add Employee records from DB
    employees.forEach((emp) => {
        const channelId = `chat-emp-${emp._id}`;
        const initials = emp.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
        list.push({
            id: emp._id.toString(),
            channelId,
            name: emp.name,
            role: emp.designation || emp.role || emp.department || "Engineering Specialist",
            email: emp.email,
            avatar: initials || "EX",
            online: true,
        });
    });
    // 2. Add non-client User records from DB if not already present
    users.forEach((usr) => {
        const alreadyAdded = list.some((e) => e.email.toLowerCase() === usr.email.toLowerCase());
        if (!alreadyAdded) {
            const channelId = `chat-usr-${usr._id}`;
            const initials = usr.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
            list.push({
                id: usr._id.toString(),
                channelId,
                name: usr.name,
                role: usr.role === "SUPER_ADMIN" ? "Chief Systems Admin" : usr.role === "EMPLOYEE" ? "Lead Engineer" : usr.role,
                email: usr.email,
                avatar: initials || "UX",
                online: true,
            });
        }
    });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, list, "Team members retrieved successfully"));
});
// POST /api/v1/chat/purge-dummy-data (Utility to clean legacy dummy messages)
exports.purgeDummyMessages = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    await chat_message_model_js_1.ChatMessage.deleteMany({
        channelId: { $in: ["client-alexander-vance", "client-elena-rostova", "client-aris-thorne", "client-devops", "engineering-guild", "veloce-saas-team"] }
    });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Dummy messages purged successfully"));
});

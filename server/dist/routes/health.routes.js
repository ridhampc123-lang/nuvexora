"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    const isDbConnected = mongoose_1.default.connection.readyState === 1;
    const memoryUsage = process.memoryUsage();
    const healthData = {
        status: isDbConnected ? "HEALTHY" : "DEGRADED",
        service: "Nuvexora Technologies Backend API",
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        database: {
            status: isDbConnected ? "CONNECTED" : "DISCONNECTED",
            readyState: mongoose_1.default.connection.readyState,
        },
        system: {
            heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
        },
        version: "1.0.0",
    };
    const statusCode = isDbConnected ? 200 : 503;
    return res.status(statusCode).json(healthData);
});
exports.default = router;

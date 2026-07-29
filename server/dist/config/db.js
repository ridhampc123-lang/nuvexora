"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nuvexora_db";
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`[MongoDB] Connected: ${conn.connection.host} / ${conn.connection.name}`);
    }
    catch (error) {
        console.error(`[MongoDB Error] Failed to connect:`, error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;

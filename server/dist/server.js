"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
const app_js_1 = require("./app.js");
const db_js_1 = require("./config/db.js");
const index_js_1 = require("./socket/index.js");
const seed_js_1 = require("./seed/seed.js");
const PORT = process.env.PORT || 5000;
const httpServer = (0, http_1.createServer)(app_js_1.app);
// Initialize Socket.IO Real-time Server
(0, index_js_1.initSocketIO)(httpServer);
// Connect to Database & Start Listener
(0, db_js_1.connectDB)().then(async () => {
    await (0, seed_js_1.seedDatabase)();
    httpServer.listen(PORT, () => {
        console.log(`[Server] Nuvexora API Engine running on http://localhost:${PORT}`);
        console.log(`[Socket.IO] Real-time engine ready on ws://localhost:${PORT}`);
    });
});

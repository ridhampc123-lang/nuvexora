"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = require("express-rate-limit");
const index_js_1 = __importDefault(require("./routes/index.js"));
const error_middleware_js_1 = require("./middleware/error.middleware.js");
const api_error_js_1 = require("./utils/api-error.js");
const app = (0, express_1.default)();
exports.app = app;
// Security & Optimization Middlewares
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Rate Limiter: 100 requests per 15 minutes per IP
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, statusCode: 429, message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);
// Logging & Body Parsers
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use((0, cookie_parser_1.default)());
// Base Health Check
app.get("/", (_req, res) => {
    res.status(200).json({
        message: "Nuvexora Technologies Enterprise API Engine v1.0",
        documentation: "/api/v1/health",
    });
});
// API Routes
app.use("/api/v1", index_js_1.default);
// 404 Handler
app.use("*", (_req, _res, next) => {
    next(new api_error_js_1.ApiError(404, "Requested API route not found"));
});
// Global Error Handler
app.use(error_middleware_js_1.errorHandler);

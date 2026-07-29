import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { ApiError } from "./utils/api-error.js";

const app: Application = express();

// Security & Optimization Middlewares
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate Limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, statusCode: 429, message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Logging & Body Parsers
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Base Health Check
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Nuvexora Technologies Enterprise API Engine v1.0",
    documentation: "/api/v1/health",
  });
});

// API Routes
app.use("/api/v1", apiRoutes);

// 404 Handler
app.use("*", (_req, _res, next) => {
  next(new ApiError(404, "Requested API route not found"));
});

// Global Error Handler
app.use(errorHandler);

export { app };

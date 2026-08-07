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
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-side Next.js rewrites)
      if (!origin) return callback(null, true);

      const clientUrl = process.env.CLIENT_URL;
      const isVercel = origin.endsWith(".vercel.app");
      const isLocal =
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        /^http:\/\/(192\.168|10|172\.(1[6-9]|2[0-9]|3[0-1]))\./.test(origin);

      if (
        isVercel ||
        isLocal ||
        !clientUrl ||
        origin === clientUrl ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
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

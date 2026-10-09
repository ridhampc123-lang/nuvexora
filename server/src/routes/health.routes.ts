import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const memoryUsage = process.memoryUsage();

  const healthData = {
    status: isDbConnected ? "HEALTHY" : "DEGRADED",
    service: "Nuvexora Technologies Backend API",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: isDbConnected ? "CONNECTED" : "DISCONNECTED",
      readyState: mongoose.connection.readyState,
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

export default router;

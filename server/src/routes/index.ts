import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import leadRoutes from "./lead.routes.js";
import projectRoutes from "./project.routes.js";
import blogRoutes from "./blog.routes.js";
import publicRoutes from "./public.routes.js";
import adminRoutes from "./admin.routes.js";
import clientRoutes from "./client.routes.js";
import businessRoutes from "./business.routes.js";
import employeeRoutes from "./employee.routes.js";
import serviceRoutes from "./service.routes.js";
import chatRoutes from "./chat.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/public", publicRoutes);
router.use("/admin", adminRoutes);
router.use("/client", clientRoutes);
router.use("/business", businessRoutes);
router.use("/employee", employeeRoutes);
router.use("/leads", leadRoutes);
router.use("/projects", projectRoutes);
router.use("/blogs", blogRoutes);
router.use("/services", serviceRoutes);
router.use("/chat", chatRoutes);

export default router;

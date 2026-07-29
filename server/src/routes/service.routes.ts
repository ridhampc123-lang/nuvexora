import { Router } from "express";
import { 
  getAllServices, 
  getServiceById, 
  getServiceBySlug, 
  createService, 
  updateService, 
  deleteService 
} from "../controllers/service.controller.js";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes (if any specific, usually public is handled in public.routes, but let's expose these for flexibility)
router.get("/", getAllServices);
router.get("/slug/:slug", getServiceBySlug);
router.get("/:id", getServiceById);

// Admin routes
router.use(verifyJWT, requireRole("SUPER_ADMIN", "ADMIN"));
router.post("/", createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

export default router;

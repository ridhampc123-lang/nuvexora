"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_controller_js_1 = require("../controllers/service.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
// Public routes (if any specific, usually public is handled in public.routes, but let's expose these for flexibility)
router.get("/", service_controller_js_1.getAllServices);
router.get("/slug/:slug", service_controller_js_1.getServiceBySlug);
router.get("/:id", service_controller_js_1.getServiceById);
// Admin routes
router.use(auth_middleware_js_1.verifyJWT, (0, auth_middleware_js_1.requireRole)("SUPER_ADMIN", "ADMIN"));
router.post("/", service_controller_js_1.createService);
router.patch("/:id", service_controller_js_1.updateService);
router.delete("/:id", service_controller_js_1.deleteService);
exports.default = router;

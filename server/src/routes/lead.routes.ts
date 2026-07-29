import { Router } from "express";
import { createLead, getLeads, updateLeadStatus } from "../controllers/lead.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createLeadSchema } from "../validations/lead.validation.js";
import { verifyJWT, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", validate(createLeadSchema), createLead);
router.get("/", verifyJWT, authorize("admin"), getLeads);
router.patch("/:id/status", verifyJWT, authorize("admin"), updateLeadStatus);

export default router;

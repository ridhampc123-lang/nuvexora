import { Router } from "express";
import {
  getDealsPipeline,
  createDeal,
  updateDealStatus,
  getEmployees,
  getTickets,
  getFinanceLedger,
  generateAiContent,
} from "../controllers/business.controller.js";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// CRM pipeline restricted to Admin, Sales, and Leadership
router.get("/crm/deals", requireRole("SUPER_ADMIN", "ADMIN", "SALES", "MANAGER"), getDealsPipeline);
router.post("/crm/deals", requireRole("SUPER_ADMIN", "ADMIN", "SALES", "MANAGER"), createDeal);
router.patch("/crm/deals/:id", requireRole("SUPER_ADMIN", "ADMIN", "SALES", "MANAGER"), updateDealStatus);

// Internal HR employee directory restricted to Admin, HR, and Leadership
router.get("/hr/employees", requireRole("SUPER_ADMIN", "ADMIN", "HR", "MANAGER"), getEmployees);

// Support tickets desk overview
router.get("/support/tickets", requireRole("SUPER_ADMIN", "ADMIN", "MANAGER"), getTickets);

// Corporate finance & gross ledger strictly restricted to Finance & System Admins
router.get("/finance/ledger", requireRole("SUPER_ADMIN", "ADMIN", "FINANCE"), getFinanceLedger);

// AI generator restricted to privileged staff
router.post("/ai/generate", requireRole("SUPER_ADMIN", "ADMIN", "MANAGER", "SALES"), generateAiContent);

export default router;


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
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/crm/deals", getDealsPipeline);
router.post("/crm/deals", createDeal);
router.patch("/crm/deals/:id", updateDealStatus);
router.get("/hr/employees", getEmployees);
router.get("/support/tickets", getTickets);
router.get("/finance/ledger", getFinanceLedger);
router.post("/ai/generate", generateAiContent);

export default router;


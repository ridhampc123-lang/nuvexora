import { Router } from "express";
import { 
  getClientDashboardData, 
  getClientProjects, 
  getClientTasks, 
  updateClientTask, 
  getClientInvoices, 
  payClientInvoice 
} from "../controllers/client.controller.js";

const router = Router();

router.get("/dashboard", getClientDashboardData);
router.get("/projects", getClientProjects);
router.get("/tasks", getClientTasks);
router.patch("/tasks/:id", updateClientTask);
router.get("/invoices", getClientInvoices);
router.post("/invoices/:id/pay", payClientInvoice);

export default router;


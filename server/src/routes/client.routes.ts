import { Router } from "express";
import { 
  getClientDashboardData, 
  getClientProjects, 
  getClientTasks, 
  updateClientTask, 
  getClientInvoices, 
  payClientInvoice,
  getClientMeetings,
  scheduleClientMeeting,
  getClientTickets,
  createClientTicket,
  getClientApprovals,
  approveClientDeliverable,
  requestDeliverableChanges,
  getClientProfile,
  updateClientProfile
} from "../controllers/client.controller.js";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT, requireRole("CLIENT"));

router.get("/dashboard", getClientDashboardData);
router.get("/projects", getClientProjects);
router.get("/tasks", getClientTasks);
router.patch("/tasks/:id", updateClientTask);
router.get("/invoices", getClientInvoices);
router.post("/invoices/:id/pay", payClientInvoice);

// Meetings
router.get("/meetings", getClientMeetings);
router.post("/meetings", scheduleClientMeeting);

// Support Desk Tickets
router.get("/tickets", getClientTickets);
router.post("/tickets", createClientTicket);

// Deliverable Approvals & Stage Gates
router.get("/approvals", getClientApprovals);
router.post("/approvals/:id/approve", approveClientDeliverable);
router.post("/approvals/:id/request-changes", requestDeliverableChanges);

// Profile Settings
router.get("/profile", getClientProfile);
router.put("/profile", updateClientProfile);

export default router;



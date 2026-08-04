import { Router } from "express";
import {
  getAdminDashboardMetrics,
  getAllUsers,
  updateUser,
  getAllLeads,
  updateLeadStatus,
  deleteLead,

  getAllClients,
  createClient,
  updateClient,
  getClientById,
  deleteClient,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  getEmployeeById,
  deleteEmployee,
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getAllAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAllLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getAllMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getAllInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getAllProposals,
  createProposal,
  updateProposal,
  deleteProposal,
  getAllContracts,
  createContract,
  updateContract,
  deleteContract,
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getAllTickets,
  updateTicket,
  deleteTicket,
  uploadMediaImage,
  getAuditLogs,
  getPermissions,
  getRoles,
  createRole,
  getAllServices,
  createService,
  updateService,
  deleteService,
  getAllMedia,
  deleteMedia,
  getAllCareers,
  createCareer,
  updateCareer,
  deleteCareer,
  getAdminAnalyticsData,
  getAdminReportsData
} from "../controllers/admin.controller.js";
import { upload } from "../config/cloudinary.js";
import { getAdminBlogs, updateBlog, deleteBlog, createBlog as createAdminBlog } from "../controllers/admin-blog.controller.js";
import { getAdminPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from "../controllers/admin-portfolio.controller.js";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT, requireRole("SUPER_ADMIN", "ADMIN"));

// Media Image Upload Endpoint
router.post("/upload", upload.single("image"), uploadMediaImage);

// Blogs Management
router.get("/blogs", getAdminBlogs);
router.post("/blogs", createAdminBlog);
router.patch("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

// Portfolio Management
router.get("/portfolio", getAdminPortfolio);
router.post("/portfolio", createPortfolioItem);
router.patch("/portfolio/:id", updatePortfolioItem);
router.delete("/portfolio/:id", deletePortfolioItem);

// Dashboard Metrics
router.get("/metrics", getAdminDashboardMetrics);

// Users Management
router.get("/users", getAllUsers);
router.patch("/users/:id", updateUser);

// Leads Management
router.get("/leads", getAllLeads);
router.patch("/leads/:id", updateLeadStatus);
router.delete("/leads/:id", deleteLead);



// Clients CRM Management
router.get("/clients", getAllClients);
router.post("/clients", createClient);
router.patch("/clients/:id", updateClient);
router.get("/clients/:id", getClientById);
router.delete("/clients/:id", deleteClient);

// Employees Management
router.get("/employees", getAllEmployees);
router.get("/employees/:id", getEmployeeById);
router.post("/employees", createEmployee);
router.patch("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);

// Departments Management
router.get("/departments", getAllDepartments);
router.post("/departments", createDepartment);
router.patch("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

// Attendance Management
router.get("/attendance", getAllAttendance);
router.post("/attendance", createAttendance);
router.patch("/attendance/:id", updateAttendance);
router.delete("/attendance/:id", deleteAttendance);

// Leave Requests Management
router.get("/leave", getAllLeaveRequests);
router.post("/leave", createLeaveRequest);
router.patch("/leave/:id", updateLeaveRequest);
router.delete("/leave/:id", deleteLeaveRequest);

// Task Management
router.get("/tasks", getAllTasks);
router.post("/tasks", createTask);
router.patch("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

// Project Management
router.get("/projects", getAllProjects);
router.post("/projects", createProject);
router.patch("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

// Milestone Management
router.get("/milestones", getAllMilestones);
router.post("/milestones", createMilestone);
router.patch("/milestones/:id", updateMilestone);
router.delete("/milestones/:id", deleteMilestone);

// Invoice Management
router.get("/invoices", getAllInvoices);
router.post("/invoices", createInvoice);
router.patch("/invoices/:id", updateInvoice);
router.delete("/invoices/:id", deleteInvoice);

// Payment Management
router.get("/payments", getAllPayments);
router.post("/payments", createPayment);
router.patch("/payments/:id", updatePayment);
router.delete("/payments/:id", deletePayment);

// Proposal Management
router.get("/proposals", getAllProposals);
router.post("/proposals", createProposal);
router.patch("/proposals/:id", updateProposal);
router.delete("/proposals/:id", deleteProposal);

// Contract Management
router.get("/contracts", getAllContracts);
router.post("/contracts", createContract);
router.patch("/contracts/:id", updateContract);
router.delete("/contracts/:id", deleteContract);

// Message Management
router.get("/messages", getAllMessages);
router.patch("/messages/:id", updateMessageStatus);
router.delete("/messages/:id", deleteMessage);

// Meeting Management
router.get("/meetings", getAllMeetings);
router.post("/meetings", createMeeting);
router.patch("/meetings/:id", updateMeeting);
router.delete("/meetings/:id", deleteMeeting);

// Ticket Management
router.get("/tickets", getAllTickets);
router.patch("/tickets/:id", updateTicket);
router.delete("/tickets/:id", deleteTicket);

// Audit Logs
router.get("/audit-logs", getAuditLogs);

// Permissions
router.get("/permissions", getPermissions);

// Roles
router.get("/roles", getRoles);
router.post("/roles", createRole);

// Services Management
router.get("/services", getAllServices);
router.post("/services", createService);
router.patch("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// Media Management
router.get("/media", getAllMedia);
router.delete("/media/:id", deleteMedia);

// Careers Management
router.get("/careers", getAllCareers);
router.post("/careers", createCareer);
router.patch("/careers/:id", updateCareer);
router.delete("/careers/:id", deleteCareer);

// Analytics & Reports
router.get("/analytics", getAdminAnalyticsData);
router.get("/reports", getAdminReportsData);

export default router;


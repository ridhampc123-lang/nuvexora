"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_js_1 = require("../controllers/admin.controller.js");
const cloudinary_js_1 = require("../config/cloudinary.js");
const admin_blog_controller_js_1 = require("../controllers/admin-blog.controller.js");
const admin_portfolio_controller_js_1 = require("../controllers/admin-portfolio.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.verifyJWT);
router.use((0, auth_middleware_js_1.requireRoleOrPermission)(["SUPER_ADMIN", "ADMIN"], [
    "ROLES_MANAGE",
    "USERS_VIEW",
    "USERS_MANAGE",
    "PROJECTS_VIEW",
    "PROJECTS_MANAGE",
    "INVOICES_VIEW",
    "INVOICES_MANAGE",
    "LEADS_VIEW",
    "LEADS_MANAGE",
    "AUDIT_VIEW",
    "MEDIA_MANAGE",
    "BLOG_MANAGE",
    "TASKS_VIEW",
    "TASKS_MANAGE"
]));
// Media Image Upload Endpoint
router.post("/upload", cloudinary_js_1.upload.single("image"), admin_controller_js_1.uploadMediaImage);
// Blogs Management
router.get("/blogs", admin_blog_controller_js_1.getAdminBlogs);
router.post("/blogs", admin_blog_controller_js_1.createBlog);
router.patch("/blogs/:id", admin_blog_controller_js_1.updateBlog);
router.delete("/blogs/:id", admin_blog_controller_js_1.deleteBlog);
// Portfolio Management
router.get("/portfolio", admin_portfolio_controller_js_1.getAdminPortfolio);
router.post("/portfolio", admin_portfolio_controller_js_1.createPortfolioItem);
router.patch("/portfolio/:id", admin_portfolio_controller_js_1.updatePortfolioItem);
router.delete("/portfolio/:id", admin_portfolio_controller_js_1.deletePortfolioItem);
// Dashboard Metrics
router.get("/metrics", admin_controller_js_1.getAdminDashboardMetrics);
// Users Management
router.get("/users", admin_controller_js_1.getAllUsers);
router.patch("/users/:id", admin_controller_js_1.updateUser);
router.delete("/users/:id", admin_controller_js_1.deleteUser);
// Leads Management
router.get("/leads", admin_controller_js_1.getAllLeads);
router.patch("/leads/:id", admin_controller_js_1.updateLeadStatus);
router.post("/leads/:id/send-meeting", admin_controller_js_1.sendLeadMeetingLink);
router.delete("/leads/:id", admin_controller_js_1.deleteLead);
// Clients CRM Management
router.get("/clients", admin_controller_js_1.getAllClients);
router.post("/clients", admin_controller_js_1.createClient);
router.patch("/clients/:id", admin_controller_js_1.updateClient);
router.get("/clients/:id", admin_controller_js_1.getClientById);
router.delete("/clients/:id", admin_controller_js_1.deleteClient);
// Employees Management
router.get("/employees", admin_controller_js_1.getAllEmployees);
router.get("/employees/:id", admin_controller_js_1.getEmployeeById);
router.post("/employees", admin_controller_js_1.createEmployee);
router.patch("/employees/:id", admin_controller_js_1.updateEmployee);
router.delete("/employees/:id", admin_controller_js_1.deleteEmployee);
// Departments Management
router.get("/departments", admin_controller_js_1.getAllDepartments);
router.post("/departments", admin_controller_js_1.createDepartment);
router.patch("/departments/:id", admin_controller_js_1.updateDepartment);
router.delete("/departments/:id", admin_controller_js_1.deleteDepartment);
// Attendance Management
router.get("/attendance", admin_controller_js_1.getAllAttendance);
router.post("/attendance", admin_controller_js_1.createAttendance);
router.patch("/attendance/:id", admin_controller_js_1.updateAttendance);
router.delete("/attendance/:id", admin_controller_js_1.deleteAttendance);
// Leave Requests Management
router.get("/leave", admin_controller_js_1.getAllLeaveRequests);
router.post("/leave", admin_controller_js_1.createLeaveRequest);
router.patch("/leave/:id", admin_controller_js_1.updateLeaveRequest);
router.delete("/leave/:id", admin_controller_js_1.deleteLeaveRequest);
// Task Management
router.get("/tasks", admin_controller_js_1.getAllTasks);
router.post("/tasks", admin_controller_js_1.createTask);
router.patch("/tasks/:id", admin_controller_js_1.updateTask);
router.delete("/tasks/:id", admin_controller_js_1.deleteTask);
// Project Management
router.get("/projects", admin_controller_js_1.getAllProjects);
router.post("/projects", admin_controller_js_1.createProject);
router.patch("/projects/:id", admin_controller_js_1.updateProject);
router.delete("/projects/:id", admin_controller_js_1.deleteProject);
// Milestone Management
router.get("/milestones", admin_controller_js_1.getAllMilestones);
router.post("/milestones", admin_controller_js_1.createMilestone);
router.patch("/milestones/:id", admin_controller_js_1.updateMilestone);
router.delete("/milestones/:id", admin_controller_js_1.deleteMilestone);
// Invoice Management
router.get("/invoices", admin_controller_js_1.getAllInvoices);
router.post("/invoices", admin_controller_js_1.createInvoice);
router.patch("/invoices/:id", admin_controller_js_1.updateInvoice);
router.delete("/invoices/:id", admin_controller_js_1.deleteInvoice);
// Payment Management
router.get("/payments", admin_controller_js_1.getAllPayments);
router.post("/payments", admin_controller_js_1.createPayment);
router.patch("/payments/:id", admin_controller_js_1.updatePayment);
router.delete("/payments/:id", admin_controller_js_1.deletePayment);
// Proposal Management
router.get("/proposals", admin_controller_js_1.getAllProposals);
router.post("/proposals", admin_controller_js_1.createProposal);
router.patch("/proposals/:id", admin_controller_js_1.updateProposal);
router.delete("/proposals/:id", admin_controller_js_1.deleteProposal);
// Contract Management
router.get("/contracts", admin_controller_js_1.getAllContracts);
router.post("/contracts", admin_controller_js_1.createContract);
router.patch("/contracts/:id", admin_controller_js_1.updateContract);
router.delete("/contracts/:id", admin_controller_js_1.deleteContract);
// Message Management
router.get("/messages", admin_controller_js_1.getAllMessages);
router.patch("/messages/:id", admin_controller_js_1.updateMessageStatus);
router.delete("/messages/:id", admin_controller_js_1.deleteMessage);
// Meeting Management
router.get("/meetings", admin_controller_js_1.getAllMeetings);
router.post("/meetings", admin_controller_js_1.createMeeting);
router.patch("/meetings/:id", admin_controller_js_1.updateMeeting);
router.delete("/meetings/:id", admin_controller_js_1.deleteMeeting);
// Ticket Management
router.get("/tickets", admin_controller_js_1.getAllTickets);
router.patch("/tickets/:id", admin_controller_js_1.updateTicket);
router.delete("/tickets/:id", admin_controller_js_1.deleteTicket);
// Audit Logs
router.get("/audit-logs", admin_controller_js_1.getAuditLogs);
// Permissions
router.get("/permissions", admin_controller_js_1.getPermissions);
// Roles
router.get("/roles", admin_controller_js_1.getRoles);
router.post("/roles", admin_controller_js_1.createRole);
router.patch("/roles/:id", admin_controller_js_1.updateRole);
router.delete("/roles/:id", admin_controller_js_1.deleteRole);
// Services Management
router.get("/services", admin_controller_js_1.getAllServices);
router.post("/services", admin_controller_js_1.createService);
router.patch("/services/:id", admin_controller_js_1.updateService);
router.delete("/services/:id", admin_controller_js_1.deleteService);
// Media Management
router.get("/media", admin_controller_js_1.getAllMedia);
router.delete("/media/:id", admin_controller_js_1.deleteMedia);
// Careers Management
router.get("/careers", admin_controller_js_1.getAllCareers);
router.post("/careers", admin_controller_js_1.createCareer);
router.patch("/careers/:id", admin_controller_js_1.updateCareer);
router.delete("/careers/:id", admin_controller_js_1.deleteCareer);
// Analytics & Reports
router.get("/analytics", admin_controller_js_1.getAdminAnalyticsData);
router.get("/reports", admin_controller_js_1.getAdminReportsData);
exports.default = router;

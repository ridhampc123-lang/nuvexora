"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_js_1 = require("../controllers/admin.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.verifyJWT, (0, auth_middleware_js_1.requireRole)("SUPER_ADMIN", "ADMIN"));
// Dashboard Metrics
router.get("/metrics", admin_controller_js_1.getAdminDashboardMetrics);
// Users Management
router.get("/users", admin_controller_js_1.getAllUsers);
router.patch("/users/:id", admin_controller_js_1.updateUser);
// Leads Management
router.get("/leads", admin_controller_js_1.getAllLeads);
router.patch("/leads/:id", admin_controller_js_1.updateLeadStatus);
// Clients CRM Management
router.get("/clients", admin_controller_js_1.getAllClients);
router.post("/clients", admin_controller_js_1.createClient);
router.patch("/clients/:id", admin_controller_js_1.updateClient);
router.get("/clients/:id", admin_controller_js_1.getClientById);
// Employees Management
router.get("/employees", admin_controller_js_1.getAllEmployees);
router.get("/employees/:id", admin_controller_js_1.getEmployeeById);
router.post("/employees", admin_controller_js_1.createEmployee);
router.patch("/employees/:id", admin_controller_js_1.updateEmployee);
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
exports.default = router;

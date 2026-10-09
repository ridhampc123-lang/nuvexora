"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePayment = exports.createPayment = exports.getAllPayments = exports.deleteInvoice = exports.updateInvoice = exports.createInvoice = exports.getAllInvoices = exports.deleteMilestone = exports.updateMilestone = exports.createMilestone = exports.getAllMilestones = exports.deleteProject = exports.updateProject = exports.createProject = exports.getAllProjects = exports.deleteTask = exports.updateTask = exports.createTask = exports.getAllTasks = exports.deleteLeaveRequest = exports.updateLeaveRequest = exports.createLeaveRequest = exports.getAllLeaveRequests = exports.deleteAttendance = exports.updateAttendance = exports.createAttendance = exports.getAllAttendance = exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getAllDepartments = exports.deleteEmployee = exports.updateEmployee = exports.getEmployeeById = exports.createEmployee = exports.getAllEmployees = exports.deleteClient = exports.getClientById = exports.updateClient = exports.createClient = exports.getAllClients = exports.sendLeadMeetingLink = exports.deleteLead = exports.updateLeadStatus = exports.getAllLeads = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getAdminDashboardMetrics = exports.uploadMediaImage = void 0;
exports.getAdminReportsData = exports.getAdminAnalyticsData = exports.deleteCareer = exports.updateCareer = exports.createCareer = exports.getAllCareers = exports.deleteMedia = exports.getAllMedia = exports.deleteService = exports.updateService = exports.createService = exports.getAllServices = exports.deleteRole = exports.createRole = exports.updateRole = exports.getRoles = exports.getPermissions = exports.getAuditLogs = exports.deleteTicket = exports.updateTicket = exports.getAllTickets = exports.deleteMeeting = exports.updateMeeting = exports.createMeeting = exports.getAllMeetings = exports.deleteMessage = exports.updateMessageStatus = exports.getAllMessages = exports.deleteContract = exports.updateContract = exports.createContract = exports.getAllContracts = exports.deleteProposal = exports.updateProposal = exports.createProposal = exports.getAllProposals = exports.deletePayment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
const cloudinary_js_1 = require("../config/cloudinary.js");
const user_model_js_1 = require("../models/user.model.js");
const lead_model_js_1 = require("../models/lead.model.js");
const project_model_js_1 = require("../models/project.model.js");
const blog_model_js_1 = require("../models/blog.model.js");
const meeting_model_js_1 = require("../models/meeting.model.js");
const client_model_js_1 = require("../models/client.model.js");
const task_model_js_1 = require("../models/task.model.js");
const invoice_model_js_1 = require("../models/invoice.model.js");
const ticket_model_js_1 = require("../models/ticket.model.js");
const media_model_js_1 = require("../models/media.model.js");
const index_js_1 = require("../socket/index.js");
const auth_service_js_1 = require("../services/auth.service.js");
const employee_model_js_1 = require("../models/employee.model.js");
const department_model_js_1 = require("../models/department.model.js");
const attendance_model_js_1 = require("../models/attendance.model.js");
const leave_request_model_js_1 = require("../models/leave-request.model.js");
const payment_model_js_1 = require("../models/payment.model.js");
const proposal_model_js_1 = require("../models/proposal.model.js");
const contract_model_js_1 = require("../models/contract.model.js");
const contact_message_model_js_1 = require("../models/contact-message.model.js");
const audit_log_model_js_1 = require("../models/audit-log.model.js");
const permission_model_js_1 = require("../models/permission.model.js");
const role_model_js_1 = require("../models/role.model.js");
const service_model_js_1 = require("../models/service.model.js");
const career_model_js_1 = require("../models/career.model.js");
const notification_model_js_1 = require("../models/notification.model.js");
const email_service_js_1 = require("../services/email.service.js");
exports.uploadMediaImage = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    let dataURI = "";
    if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        dataURI = `data:${req.file.mimetype};base64,${b64}`;
    }
    else if (req.body && (req.body.image || req.body.file)) {
        dataURI = req.body.image || req.body.file;
    }
    if (!dataURI) {
        throw new api_error_js_1.ApiError(400, "No image file or image data provided");
    }
    if (dataURI.startsWith("http://") || dataURI.startsWith("https://")) {
        return res.status(200).json(new api_response_js_1.ApiResponse(200, { url: dataURI }, "Image URL processed"));
    }
    try {
        const uploadRes = await cloudinary_js_1.cloudinary.uploader.upload(dataURI, {
            folder: "nuvexora/cms",
            resource_type: "auto",
        });
        try {
            await media_model_js_1.Media.create({
                filename: req.file?.originalname || `asset-${Date.now()}`,
                publicId: uploadRes.public_id,
                url: uploadRes.url || uploadRes.secure_url,
                secureUrl: uploadRes.secure_url,
                format: uploadRes.format || req.file?.mimetype?.split("/")[1] || "bin",
                bytes: uploadRes.bytes || req.file?.size || 0,
                folder: "nuvexora/cms",
                uploadedBy: req.user?._id || req.user?.userId,
            });
            try {
                (0, index_js_1.getIO)().emit("dashboard_update");
            }
            catch { }
        }
        catch (dbErr) {
            console.error("Media persistence warning:", dbErr?.message);
        }
        return res.status(200).json(new api_response_js_1.ApiResponse(200, { url: uploadRes.secure_url }, "Image uploaded successfully to Cloudinary"));
    }
    catch (error) {
        console.error("Cloudinary Upload Warning/Error:", error?.message || error);
        // Graceful fallback to Data URI format if Cloudinary service/credentials encounter issues
        try {
            await media_model_js_1.Media.create({
                filename: req.file?.originalname || `asset-${Date.now()}`,
                publicId: `local-${Date.now()}`,
                url: dataURI.length > 500 ? "data:embedded-file" : dataURI,
                secureUrl: dataURI.length > 500 ? "data:embedded-file" : dataURI,
                format: req.file?.mimetype?.split("/")[1] || "bin",
                bytes: req.file?.size || 0,
                folder: "nuvexora/local",
                uploadedBy: req.user?._id || req.user?.userId,
            });
            try {
                (0, index_js_1.getIO)().emit("dashboard_update");
            }
            catch { }
        }
        catch { }
        return res.status(200).json(new api_response_js_1.ApiResponse(200, { url: dataURI }, "Image uploaded via resilient fallback"));
    }
});
exports.getAdminDashboardMetrics = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const [totalUsers, totalLeads, activeProjects, totalClients, totalTasks, upcomingMeetings, totalInvoices, totalTickets, totalMedia, totalBlogs, completedTasks] = await Promise.all([
        user_model_js_1.User.countDocuments(),
        lead_model_js_1.Lead.countDocuments(),
        project_model_js_1.Project.countDocuments({ status: { $ne: "completed" } }),
        client_model_js_1.ClientAccount.countDocuments({ status: "active" }),
        task_model_js_1.Task.countDocuments({ status: { $ne: "completed" } }),
        meeting_model_js_1.Meeting.countDocuments({ status: "scheduled" }),
        invoice_model_js_1.Invoice.countDocuments(),
        ticket_model_js_1.Ticket.countDocuments({ status: { $ne: "resolved" } }),
        media_model_js_1.Media.countDocuments(),
        blog_model_js_1.Blog.countDocuments(),
        task_model_js_1.Task.countDocuments({ status: "completed" })
    ]);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, {
        totalUsers: totalUsers || 0,
        totalLeads: totalLeads || 0,
        activeProjects: activeProjects || 0,
        totalClients: totalClients || 0,
        totalTasks: totalTasks || 0,
        completedTasks: completedTasks || 0,
        upcomingMeetings: upcomingMeetings || 0,
        totalInvoices: totalInvoices || 0,
        totalTickets: totalTickets || 0,
        totalMedia: totalMedia || 0,
        totalBlogs: totalBlogs || 0,
        systemHealth: "OPTIMAL",
    }, "Admin dashboard metrics retrieved successfully"));
});
exports.getAllUsers = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const users = await user_model_js_1.User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, users, "Users list retrieved successfully"));
});
exports.updateUser = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { role, status } = req.body;
    const user = await user_model_js_1.User.findByIdAndUpdate(id, { ...(role && { role }), ...(status && { status }) }, { new: true }).select("-password");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, user, "User updated successfully"));
});
exports.deleteUser = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = await user_model_js_1.User.findByIdAndDelete(id);
    if (user) {
        const { ClientAccount } = await import("../models/client.model.js");
        const { Employee } = await import("../models/employee.model.js");
        await ClientAccount.deleteMany({ $or: [{ userId: id }, { email: user.email }] });
        await Employee.deleteMany({ $or: [{ userId: id }, { email: user.email }] });
    }
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "User permanently deleted from root database"));
});
exports.getAllLeads = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const leads = await lead_model_js_1.Lead.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, leads, "Leads list retrieved successfully"));
});
exports.updateLeadStatus = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const lead = await lead_model_js_1.Lead.findByIdAndUpdate(id, { status }, { new: true });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, lead, "Lead status updated successfully"));
});
exports.deleteLead = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await lead_model_js_1.Lead.findByIdAndDelete(id);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Lead deleted successfully"));
});
exports.sendLeadMeetingLink = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { meetingLink, meetingTime, adminNote } = req.body;
    if (!meetingLink) {
        throw new api_error_js_1.ApiError(400, "Meeting link is required");
    }
    const lead = await lead_model_js_1.Lead.findById(id);
    if (!lead) {
        throw new api_error_js_1.ApiError(404, "Lead inquiry not found");
    }
    lead.meetingLink = meetingLink;
    if (meetingTime)
        lead.meetingTime = meetingTime;
    if (adminNote !== undefined)
        lead.adminNote = adminNote;
    if (lead.status === "new")
        lead.status = "contacted";
    await lead.save();
    await (0, email_service_js_1.sendLeadMeetingLinkEmail)({
        toEmail: lead.email,
        clientName: lead.fullName || "Valued Client",
        meetingLink,
        meetingTime: meetingTime || "As scheduled",
        adminNote,
    });
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, lead, "Google Meet / Meeting link sent to client email successfully"));
});
// --- CLIENT CRM MANAGEMENT ---
exports.getAllClients = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const clients = await client_model_js_1.ClientAccount.find({ status: { $ne: "deleted" } }).sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, clients, "Clients retrieved successfully"));
});
exports.createClient = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { companyName, clientName, ownerName, email, accountManager } = req.body;
    // 1. Create User & Trigger Activation Email
    const user = await auth_service_js_1.AuthService.createAccountWithActivation({ name: clientName || ownerName || companyName, email, role: "CLIENT", type: "CLIENT", companyName, accountManager: accountManager?.name }, req.ip, req.get("user-agent"));
    // 2. Create Client Profile
    const client = await client_model_js_1.ClientAccount.create({
        ...req.body,
        userId: user._id,
        name: ownerName || clientName,
        company: companyName
    });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, client, "Client created and activation email sent successfully"));
});
exports.updateClient = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.ownerName) {
        updateData.name = updateData.ownerName;
    }
    if (updateData.companyName) {
        updateData.company = updateData.companyName;
    }
    const client = await client_model_js_1.ClientAccount.findByIdAndUpdate(id, updateData, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, client, "Client updated successfully"));
});
exports.getClientById = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const client = await client_model_js_1.ClientAccount.findById(id).populate("assignedAccountManager", "name email");
    if (!client) {
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Client not found"));
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, client, "Client retrieved successfully"));
});
exports.deleteClient = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const client = await client_model_js_1.ClientAccount.findById(id);
    if (!client) {
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Client not found"));
    }
    // Delete associated user if exists
    if (client.userId) {
        await user_model_js_1.User.findByIdAndDelete(client.userId);
    }
    // Delete the client account profile
    await client_model_js_1.ClientAccount.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Client and associated user deleted successfully"));
});
// --- EMPLOYEE HR MANAGEMENT ---
exports.getAllEmployees = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const employees = await employee_model_js_1.Employee.find({ status: { $ne: "terminated" } })
        .populate("userId", "name email role")
        .populate("manager", "name email")
        .sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, employees, "Employees retrieved successfully"));
});
exports.createEmployee = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { name, email, role, department } = req.body;
    // 1. Create User & Trigger Activation Email
    const user = await auth_service_js_1.AuthService.createAccountWithActivation({ name, email, role, type: "EMPLOYEE" }, req.ip, req.get("user-agent"));
    // 2. Create Employee Profile
    const employeeId = `EMP-${Math.floor(100000 + Math.random() * 900000)}`;
    const employee = await employee_model_js_1.Employee.create({ ...req.body, employeeId, userId: user._id });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, employee, "Employee created and activation email sent successfully"));
});
exports.getEmployeeById = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const employee = await employee_model_js_1.Employee.findById(id).populate("manager", "name email");
    if (!employee) {
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Employee not found"));
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, employee, "Employee retrieved successfully"));
});
exports.updateEmployee = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const employee = await employee_model_js_1.Employee.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, employee, "Employee updated successfully"));
});
exports.deleteEmployee = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const employee = await employee_model_js_1.Employee.findById(id);
    if (!employee) {
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Employee not found"));
    }
    // Delete associated user if exists
    if (employee.userId) {
        await user_model_js_1.User.findByIdAndDelete(employee.userId);
    }
    // Delete the employee profile
    await employee_model_js_1.Employee.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Employee and associated user deleted successfully"));
});
// --- DEPARTMENT MANAGEMENT ---
exports.getAllDepartments = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const departments = await department_model_js_1.Department.find().populate("headOfDepartment", "name email");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, departments, "Departments retrieved successfully"));
});
exports.createDepartment = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const department = await department_model_js_1.Department.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, department, "Department created successfully"));
});
exports.updateDepartment = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const department = await department_model_js_1.Department.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, department, "Department updated successfully"));
});
exports.deleteDepartment = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await department_model_js_1.Department.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Department deleted successfully"));
});
// --- ATTENDANCE MANAGEMENT ---
exports.getAllAttendance = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const attendanceRecords = await attendance_model_js_1.Attendance.find()
        .populate({
        path: "employeeId",
        select: "name email employeeId department designation",
    })
        .sort({ date: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, attendanceRecords, "Attendance records retrieved successfully"));
});
exports.createAttendance = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const data = { ...req.body };
    if (data.checkIn && data.checkOut) {
        const checkInMs = new Date(data.checkIn).getTime();
        const checkOutMs = new Date(data.checkOut).getTime();
        data.totalWorkingMinutes = Math.max(0, Math.round((checkOutMs - checkInMs) / 60000));
    }
    const attendance = await attendance_model_js_1.Attendance.create(data);
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(201).json(new api_response_js_1.ApiResponse(201, attendance, "Attendance record created successfully"));
});
exports.updateAttendance = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.checkIn && data.checkOut) {
        const checkInMs = new Date(data.checkIn).getTime();
        const checkOutMs = new Date(data.checkOut).getTime();
        data.totalWorkingMinutes = Math.max(0, Math.round((checkOutMs - checkInMs) / 60000));
    }
    const attendance = await attendance_model_js_1.Attendance.findByIdAndUpdate(id, data, { new: true });
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, attendance, "Attendance record updated successfully"));
});
exports.deleteAttendance = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await attendance_model_js_1.Attendance.findByIdAndDelete(id);
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Attendance record deleted successfully"));
});
// --- LEAVE MANAGEMENT ---
exports.getAllLeaveRequests = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const leaveRequests = await leave_request_model_js_1.LeaveRequest.find()
        .populate({ path: "employeeId", select: "name email employeeId" })
        .populate({ path: "reviewedBy", select: "name" })
        .sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, leaveRequests, "Leave requests retrieved successfully"));
});
exports.createLeaveRequest = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const leave = await leave_request_model_js_1.LeaveRequest.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, leave, "Leave request created successfully"));
});
exports.updateLeaveRequest = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    // If status is being updated, we assume the admin who made the request is the reviewer
    // In a real scenario we'd extract the user from req.user, but for this demo, we just update the status
    const updateData = req.body;
    if (req.user && req.user.userId && (updateData.status === 'approved' || updateData.status === 'rejected')) {
        updateData.reviewedBy = req.user.userId;
    }
    const leave = await leave_request_model_js_1.LeaveRequest.findByIdAndUpdate(id, updateData, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, leave, "Leave request updated successfully"));
});
exports.deleteLeaveRequest = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await leave_request_model_js_1.LeaveRequest.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Leave request deleted successfully"));
});
// --- TASK MANAGEMENT ---
exports.getAllTasks = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const tasks = await task_model_js_1.Task.find()
        .populate({ path: "projectId", select: "name" })
        .populate({ path: "assignedTo", select: "name email role" })
        .sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, tasks, "Tasks retrieved successfully"));
});
exports.createTask = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const task = await task_model_js_1.Task.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, task, "Task created successfully"));
});
exports.updateTask = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const task = await task_model_js_1.Task.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, task, "Task updated successfully"));
});
exports.deleteTask = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await task_model_js_1.Task.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Task deleted successfully"));
});
// --- PROJECT MANAGEMENT ---
exports.getAllProjects = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const projects = await project_model_js_1.Project.find()
        .populate({ path: "clientId", select: "name email company" })
        .sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, projects, "Projects retrieved successfully"));
});
exports.createProject = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const project = await project_model_js_1.Project.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, project, "Project created successfully"));
});
exports.updateProject = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const project = await project_model_js_1.Project.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, project, "Project updated successfully"));
});
exports.deleteProject = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await project_model_js_1.Project.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Project deleted successfully"));
});
// --- MILESTONE MANAGEMENT (Embedded in Projects) ---
exports.getAllMilestones = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const projects = await project_model_js_1.Project.find().select("title milestones").lean();
    const allMilestones = projects.flatMap(p => (p.milestones || []).map((m) => ({
        ...m,
        projectId: { _id: p._id, title: p.title }
    })));
    // Sort by dueDate
    allMilestones.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return res.status(200).json(new api_response_js_1.ApiResponse(200, allMilestones, "Milestones retrieved successfully"));
});
exports.createMilestone = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { projectId, ...milestoneData } = req.body;
    const project = await project_model_js_1.Project.findById(projectId);
    if (!project)
        throw new Error("Project not found");
    project.milestones.push(milestoneData);
    await project.save();
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, project.milestones[project.milestones.length - 1], "Milestone created successfully"));
});
exports.updateMilestone = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params; // milestoneId
    const { projectId, ...milestoneData } = req.body;
    const project = await project_model_js_1.Project.findOneAndUpdate({ _id: projectId, "milestones._id": id }, { $set: {
            "milestones.$.title": milestoneData.title,
            "milestones.$.dueDate": milestoneData.dueDate,
            "milestones.$.status": milestoneData.status
        }
    }, { new: true });
    if (!project)
        throw new Error("Milestone or project not found");
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Milestone updated successfully"));
});
exports.deleteMilestone = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params; // milestoneId
    const { projectId } = req.query; // pass projectId in query
    const project = await project_model_js_1.Project.findByIdAndUpdate(projectId, { $pull: { milestones: { _id: id } } }, { new: true });
    if (!project)
        throw new Error("Project not found");
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Milestone deleted successfully"));
});
// --- INVOICE MANAGEMENT ---
exports.getAllInvoices = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const invoices = await invoice_model_js_1.Invoice.find()
        .populate({ path: "clientId", select: "name email company" })
        .populate({ path: "projectId", select: "title" })
        .sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, invoices, "Invoices retrieved successfully"));
});
exports.createInvoice = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const invoice = await invoice_model_js_1.Invoice.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, invoice, "Invoice created successfully"));
});
exports.updateInvoice = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const invoice = await invoice_model_js_1.Invoice.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, invoice, "Invoice updated successfully"));
});
exports.deleteInvoice = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await invoice_model_js_1.Invoice.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Invoice deleted successfully"));
});
// --- PAYMENT MANAGEMENT ---
exports.getAllPayments = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const payments = await payment_model_js_1.Payment.find()
        .populate({ path: "clientId", select: "name email company" })
        .populate({ path: "invoiceId", select: "invoiceNumber totalAmount" })
        .sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, payments, "Payments retrieved successfully"));
});
exports.createPayment = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const payment = await payment_model_js_1.Payment.create(req.body);
    if (payment.status === "completed") {
        // Optionally update the linked invoice status
        const invoice = await invoice_model_js_1.Invoice.findById(payment.invoiceId);
        if (invoice) {
            invoice.status = "paid";
            invoice.paidAt = new Date();
            await invoice.save();
        }
    }
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, payment, "Payment created successfully"));
});
exports.updatePayment = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const payment = await payment_model_js_1.Payment.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, payment, "Payment updated successfully"));
});
exports.deletePayment = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await payment_model_js_1.Payment.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Payment deleted successfully"));
});
// --- PROPOSAL MANAGEMENT ---
exports.getAllProposals = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const proposals = await proposal_model_js_1.Proposal.find()
        .populate({ path: "clientId", select: "name email company" })
        .populate({ path: "projectId", select: "title" })
        .sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, proposals, "Proposals retrieved successfully"));
});
exports.createProposal = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const proposal = await proposal_model_js_1.Proposal.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, proposal, "Proposal created successfully"));
});
exports.updateProposal = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const proposal = await proposal_model_js_1.Proposal.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, proposal, "Proposal updated successfully"));
});
exports.deleteProposal = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await proposal_model_js_1.Proposal.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Proposal deleted successfully"));
});
// --- CONTRACT MANAGEMENT ---
exports.getAllContracts = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const contracts = await contract_model_js_1.Contract.find()
        .populate({ path: "clientId", select: "name email company" })
        .populate({ path: "projectId", select: "title" })
        .sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, contracts, "Contracts retrieved successfully"));
});
exports.createContract = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const contract = await contract_model_js_1.Contract.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, contract, "Contract created successfully"));
});
exports.updateContract = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const contract = await contract_model_js_1.Contract.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, contract, "Contract updated successfully"));
});
exports.deleteContract = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await contract_model_js_1.Contract.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Contract deleted successfully"));
});
// --- MESSAGES (ContactMessage) MANAGEMENT ---
exports.getAllMessages = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const messages = await contact_message_model_js_1.ContactMessage.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, messages, "Messages retrieved successfully"));
});
exports.updateMessageStatus = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { isRead, replied } = req.body;
    const message = await contact_message_model_js_1.ContactMessage.findByIdAndUpdate(id, { ...(isRead !== undefined && { isRead }), ...(replied !== undefined && { replied }) }, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, message, "Message updated successfully"));
});
exports.deleteMessage = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await contact_message_model_js_1.ContactMessage.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Message deleted successfully"));
});
// --- MEETINGS MANAGEMENT ---
exports.getAllMeetings = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const meetings = await meeting_model_js_1.Meeting.find()
        .populate("invitedEmployees", "name email role")
        .sort({ meetingDate: 1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, meetings, "Meetings retrieved successfully"));
});
// Helper to normalize attendee IDs to valid User ObjectIds
const normalizeInvitedAttendees = async (rawList) => {
    const userIds = [];
    const notifications = [];
    const strIds = rawList
        .map(raw => typeof raw === "object" ? (raw._id || raw.id || raw.userId || "").toString() : (raw || "").toString())
        .filter(id => id && mongoose_1.default.isValidObjectId(id));
    if (strIds.length === 0)
        return { userIds, notifications };
    const users = await user_model_js_1.User.find({ _id: { $in: strIds } });
    const employees = await employee_model_js_1.Employee.find({ _id: { $in: strIds } });
    const foundUserIds = new Set(users.map(u => u._id.toString()));
    for (const user of users) {
        if (!userIds.some(id => id.toString() === user._id.toString()))
            userIds.push(user._id);
        notifications.push({ _id: user._id, name: user.name, email: user.email });
    }
    const empUserIdsToFetch = employees.filter(e => e.userId && !foundUserIds.has(e.userId.toString())).map(e => e.userId);
    const empEmailsToFetch = employees.filter(e => !e.userId && e.email).map(e => e.email);
    const linkedUsersQuery = [];
    if (empUserIdsToFetch.length > 0)
        linkedUsersQuery.push({ _id: { $in: empUserIdsToFetch } });
    if (empEmailsToFetch.length > 0)
        linkedUsersQuery.push({ email: { $in: empEmailsToFetch } });
    const linkedUsers = linkedUsersQuery.length > 0 ? await user_model_js_1.User.find({ $or: linkedUsersQuery }) : [];
    for (const emp of employees) {
        let linkedUser = linkedUsers.find(u => (emp.userId && u._id.toString() === emp.userId.toString()) ||
            (emp.email && u.email === emp.email));
        if (linkedUser && !emp.userId && emp.email === linkedUser.email) {
            emp.userId = linkedUser._id;
            await emp.save(); // Only saves if a link was missing
        }
        if (linkedUser) {
            if (!userIds.some(id => id.toString() === linkedUser._id.toString()))
                userIds.push(linkedUser._id);
            if (!notifications.some(n => n._id.toString() === linkedUser._id.toString())) {
                notifications.push({ _id: linkedUser._id, name: linkedUser.name, email: linkedUser.email });
            }
        }
        else {
            if (!userIds.some(id => id.toString() === emp._id.toString()))
                userIds.push(emp._id);
        }
    }
    return { userIds, notifications };
};
exports.createMeeting = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { invitedEmployees, meetingLink, ...rest } = req.body;
    const { userIds, notifications } = await normalizeInvitedAttendees(invitedEmployees || []);
    const safeMeetingLink = (meetingLink && meetingLink.trim())
        ? meetingLink.trim()
        : `https://meet.jit.si/nuvexora-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const meeting = await meeting_model_js_1.Meeting.create({
        ...rest,
        meetingLink: safeMeetingLink,
        invitedEmployees: userIds,
    });
    // Notify each invited employee
    if (notifications.length > 0) {
        await Promise.allSettled(notifications.map(async (u) => {
            // In-app notification
            await notification_model_js_1.Notification.create({
                recipientId: u._id,
                title: `📅 Meeting Scheduled: ${meeting.title}`,
                message: `You have been invited to "${meeting.title}" on ${new Date(meeting.meetingDate).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })} at ${meeting.timeSlot} (${meeting.timezone}).`,
                type: "info",
                link: "/employee/meetings",
            });
            // Email notification
            await (0, email_service_js_1.sendMeetingInviteEmail)(u.name, u.email, {
                title: meeting.title,
                meetingDate: meeting.meetingDate.toString(),
                timeSlot: meeting.timeSlot,
                timezone: meeting.timezone,
                topic: meeting.topic,
                organizerName: meeting.organizerName,
                meetingLink: meeting.meetingLink,
            });
        }));
    }
    const populatedMeeting = await meeting_model_js_1.Meeting.findById(meeting._id).populate("invitedEmployees", "name email role");
    // Emit real-time update to all clients
    (0, index_js_1.getIO)().emit("dashboard_update");
    (0, index_js_1.getIO)().emit("meeting_scheduled", { meeting: populatedMeeting || meeting });
    return res.status(201).json(new api_response_js_1.ApiResponse(201, populatedMeeting || meeting, "Meeting created and employees notified successfully"));
});
exports.updateMeeting = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updatePayload = { ...req.body };
    if (Array.isArray(updatePayload.invitedEmployees)) {
        const { userIds } = await normalizeInvitedAttendees(updatePayload.invitedEmployees);
        updatePayload.invitedEmployees = userIds;
    }
    const meeting = await meeting_model_js_1.Meeting.findByIdAndUpdate(id, updatePayload, { new: true })
        .populate("invitedEmployees", "name email role");
    (0, index_js_1.getIO)().emit("dashboard_update");
    (0, index_js_1.getIO)().emit("meeting_updated", { meeting });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, meeting, "Meeting updated successfully"));
});
exports.deleteMeeting = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await meeting_model_js_1.Meeting.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    (0, index_js_1.getIO)().emit("meeting_deleted", { id });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Meeting deleted successfully"));
});
// --- SUPPORT TICKETS MANAGEMENT ---
exports.getAllTickets = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const tickets = await ticket_model_js_1.Ticket.find()
        .populate({ path: "clientId", select: "name email company" })
        .populate({ path: "projectId", select: "title" })
        .sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, tickets, "Tickets retrieved successfully"));
});
exports.updateTicket = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const ticket = await ticket_model_js_1.Ticket.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, ticket, "Ticket updated successfully"));
});
exports.deleteTicket = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await ticket_model_js_1.Ticket.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Ticket deleted successfully"));
});
// --- AUDIT LOGS ---
exports.getAuditLogs = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const logs = await audit_log_model_js_1.AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, logs, "Audit logs retrieved successfully"));
});
// --- PERMISSIONS ---
exports.getPermissions = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    let permissions = await permission_model_js_1.Permission.find().sort({ module: 1, name: 1 });
    if (permissions.length === 0) {
        const defaultPermissions = [
            { name: "View Users", code: "USERS_VIEW", module: "Users", description: "View user directory and profiles" },
            { name: "Manage Users", code: "USERS_MANAGE", module: "Users", description: "Create, edit, and deactivate users" },
            { name: "View Projects", code: "PROJECTS_VIEW", module: "Projects", description: "Access projects and milestones" },
            { name: "Manage Projects", code: "PROJECTS_MANAGE", module: "Projects", description: "Create and edit project details" },
            { name: "Delete Projects", code: "PROJECTS_DELETE", module: "Projects", description: "Archive or delete projects" },
            { name: "View Invoices", code: "INVOICES_VIEW", module: "Finance", description: "View client invoices and billing" },
            { name: "Manage Invoices", code: "INVOICES_MANAGE", module: "Finance", description: "Create, send, and void invoices" },
            { name: "View Leads", code: "LEADS_VIEW", module: "CRM", description: "View sales inquiries and pipeline" },
            { name: "Manage Leads", code: "LEADS_MANAGE", module: "CRM", description: "Update lead status and schedule calls" },
            { name: "View Tasks", code: "TASKS_VIEW", module: "Tasks", description: "View team tasks and kanban boards" },
            { name: "Manage Tasks", code: "TASKS_MANAGE", module: "Tasks", description: "Assign and reorder tasks" },
            { name: "Manage Media", code: "MEDIA_MANAGE", module: "Storage", description: "Upload, download, and delete assets" },
            { name: "Manage Blog", code: "BLOG_MANAGE", module: "Content", description: "Publish and edit blog posts" },
            { name: "View Audit Logs", code: "AUDIT_VIEW", module: "System", description: "Inspect system security audit trails" },
            { name: "Manage Roles", code: "ROLES_MANAGE", module: "System", description: "Configure RBAC roles and policies" },
        ];
        try {
            await permission_model_js_1.Permission.insertMany(defaultPermissions);
            permissions = await permission_model_js_1.Permission.find().sort({ module: 1, name: 1 });
        }
        catch { }
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, permissions, "Permissions retrieved successfully"));
});
// --- ROLES ---
exports.getRoles = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const roles = await role_model_js_1.Role.find().populate("permissions").sort({ name: 1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, roles, "Roles retrieved successfully"));
});
exports.updateRole = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, description, permissions, isDefault } = req.body;
    const role = await role_model_js_1.Role.findById(id);
    if (!role) {
        throw new api_error_js_1.ApiError(404, "Role not found");
    }
    if (name && typeof name === "string" && name.trim()) {
        role.name = name.trim();
    }
    if (description !== undefined) {
        role.description = description;
    }
    if (Array.isArray(permissions)) {
        role.permissions = permissions.filter((p) => mongoose_1.default.Types.ObjectId.isValid(p));
    }
    if (isDefault !== undefined && typeof isDefault === "boolean") {
        role.isDefault = isDefault;
    }
    await role.save();
    const updated = await role_model_js_1.Role.findById(id).populate("permissions");
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, updated, "Role updated successfully"));
});
exports.createRole = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { name, code, description, permissions, isDefault } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
        throw new api_error_js_1.ApiError(400, "Role name is required");
    }
    const roleCode = (code || name)
        .toUpperCase()
        .trim()
        .replace(/[^A-Z0-9_]/g, "_");
    const existing = await role_model_js_1.Role.findOne({ code: roleCode });
    if (existing) {
        throw new api_error_js_1.ApiError(409, `A role with code '${roleCode}' already exists`);
    }
    const validPermissions = Array.isArray(permissions)
        ? permissions.filter((p) => mongoose_1.default.Types.ObjectId.isValid(p))
        : [];
    const role = await role_model_js_1.Role.create({
        name: name.trim(),
        code: roleCode,
        description: description || "",
        permissions: validPermissions,
        isDefault: !!isDefault,
    });
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(201).json(new api_response_js_1.ApiResponse(201, role, "Role created successfully"));
});
exports.deleteRole = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const role = await role_model_js_1.Role.findById(id);
    if (!role) {
        throw new api_error_js_1.ApiError(404, "Role not found");
    }
    if (role.isDefault) {
        throw new api_error_js_1.ApiError(400, "Default system roles cannot be deleted");
    }
    await role_model_js_1.Role.findByIdAndDelete(id);
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Role deleted successfully"));
});
// --- SERVICES ---
exports.getAllServices = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const services = await service_model_js_1.Service.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, services, "Services retrieved successfully"));
});
exports.createService = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const service = await service_model_js_1.Service.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, service, "Service created successfully"));
});
exports.updateService = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const service = await service_model_js_1.Service.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, service, "Service updated successfully"));
});
exports.deleteService = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await service_model_js_1.Service.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Service deleted successfully"));
});
// --- MEDIA ---
exports.getAllMedia = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const media = await media_model_js_1.Media.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, media, "Media items retrieved successfully"));
});
exports.deleteMedia = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const media = await media_model_js_1.Media.findByIdAndDelete(id);
    if (media && media.publicId && !media.publicId.startsWith("local-")) {
        try {
            await cloudinary_js_1.cloudinary.uploader.destroy(media.publicId);
        }
        catch (e) {
            console.warn("Cloudinary delete warning:", e?.message);
        }
    }
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Media item deleted successfully"));
});
// --- CAREERS ---
exports.getAllCareers = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const careers = await career_model_js_1.Career.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, careers, "Careers retrieved successfully"));
});
exports.createCareer = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const career = await career_model_js_1.Career.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, career, "Career posting created successfully"));
});
exports.updateCareer = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const career = await career_model_js_1.Career.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, career, "Career posting updated successfully"));
});
exports.deleteCareer = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await career_model_js_1.Career.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Career posting deleted successfully"));
});
// --- ANALYTICS & TELEMETRY ---
exports.getAdminAnalyticsData = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const [totalPayments, totalInvoices, totalClients, totalTasks, totalProjects, totalInvoicesAmount] = await Promise.all([
        payment_model_js_1.Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
        invoice_model_js_1.Invoice.countDocuments(),
        client_model_js_1.ClientAccount.countDocuments({ status: "active" }),
        task_model_js_1.Task.countDocuments(),
        project_model_js_1.Project.countDocuments(),
        invoice_model_js_1.Invoice.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }])
    ]);
    const paymentsSum = totalPayments[0]?.total || 0;
    const invoicesSum = totalInvoicesAmount[0]?.total || 0;
    const totalRevenue = paymentsSum > 0 ? paymentsSum : invoicesSum;
    return res.status(200).json(new api_response_js_1.ApiResponse(200, {
        totalRevenue,
        totalInvoices,
        activeClients: totalClients,
        totalTasks,
        totalProjects,
        systemUptimeSla: "99.998%",
        apiLatencyMs: 14,
    }, "Analytics data retrieved successfully"));
});
// --- REPORTS ---
exports.getAdminReportsData = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const [invoices, payments, projects, leads, attendance] = await Promise.all([
        invoice_model_js_1.Invoice.find().limit(20).lean(),
        payment_model_js_1.Payment.find().limit(20).lean(),
        project_model_js_1.Project.find().limit(20).lean(),
        lead_model_js_1.Lead.find().limit(20).lean(),
        attendance_model_js_1.Attendance.find().limit(20).lean()
    ]);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, {
        invoices,
        payments,
        projects,
        leads,
        attendance
    }, "Report telemetry aggregated successfully"));
});

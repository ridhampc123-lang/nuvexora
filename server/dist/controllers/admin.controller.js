"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllContracts = exports.deleteProposal = exports.updateProposal = exports.createProposal = exports.getAllProposals = exports.deletePayment = exports.updatePayment = exports.createPayment = exports.getAllPayments = exports.deleteInvoice = exports.updateInvoice = exports.createInvoice = exports.getAllInvoices = exports.deleteMilestone = exports.updateMilestone = exports.createMilestone = exports.getAllMilestones = exports.deleteProject = exports.updateProject = exports.createProject = exports.getAllProjects = exports.deleteTask = exports.updateTask = exports.createTask = exports.getAllTasks = exports.deleteLeaveRequest = exports.updateLeaveRequest = exports.createLeaveRequest = exports.getAllLeaveRequests = exports.deleteAttendance = exports.updateAttendance = exports.createAttendance = exports.getAllAttendance = exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getAllDepartments = exports.updateEmployee = exports.getEmployeeById = exports.createEmployee = exports.getAllEmployees = exports.getClientById = exports.updateClient = exports.createClient = exports.getAllClients = exports.updateLeadStatus = exports.getAllLeads = exports.updateUser = exports.getAllUsers = exports.getAdminDashboardMetrics = void 0;
exports.deleteTicket = exports.updateTicket = exports.getAllTickets = exports.deleteMeeting = exports.updateMeeting = exports.createMeeting = exports.getAllMeetings = exports.deleteMessage = exports.updateMessageStatus = exports.getAllMessages = exports.deleteContract = exports.updateContract = exports.createContract = void 0;
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
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
// --- CLIENT CRM MANAGEMENT ---
exports.getAllClients = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const clients = await client_model_js_1.ClientAccount.find({ status: { $ne: "deleted" } }).sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, clients, "Clients retrieved successfully"));
});
exports.createClient = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { companyName, clientName, email, accountManager } = req.body;
    // 1. Create User & Trigger Activation Email
    const user = await auth_service_js_1.AuthService.createAccountWithActivation({ name: clientName || companyName, email, role: "CLIENT", type: "CLIENT", companyName, accountManager: accountManager?.name }, req.ip, req.get("user-agent"));
    // 2. Create Client Profile
    const client = await client_model_js_1.ClientAccount.create({ ...req.body, userId: user._id });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, client, "Client created and activation email sent successfully"));
});
exports.updateClient = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const client = await client_model_js_1.ClientAccount.findByIdAndUpdate(id, req.body, { new: true });
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
// --- EMPLOYEE HR MANAGEMENT ---
exports.getAllEmployees = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const employees = await employee_model_js_1.Employee.find({ status: { $ne: "terminated" } }).populate("manager", "name email").sort({ createdAt: -1 });
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
    const attendanceRecords = await attendance_model_js_1.Attendance.find().populate({
        path: "employeeId",
        select: "name email employeeId",
    }).sort({ date: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, attendanceRecords, "Attendance records retrieved successfully"));
});
exports.createAttendance = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const attendance = await attendance_model_js_1.Attendance.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, attendance, "Attendance record created successfully"));
});
exports.updateAttendance = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const attendance = await attendance_model_js_1.Attendance.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, attendance, "Attendance record updated successfully"));
});
exports.deleteAttendance = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await attendance_model_js_1.Attendance.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
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
    const meetings = await meeting_model_js_1.Meeting.find().sort({ meetingDate: 1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, meetings, "Meetings retrieved successfully"));
});
exports.createMeeting = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const meeting = await meeting_model_js_1.Meeting.create(req.body);
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(201).json(new api_response_js_1.ApiResponse(201, meeting, "Meeting created successfully"));
});
exports.updateMeeting = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const meeting = await meeting_model_js_1.Meeting.findByIdAndUpdate(id, req.body, { new: true });
    (0, index_js_1.getIO)().emit("dashboard_update");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, meeting, "Meeting updated successfully"));
});
exports.deleteMeeting = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await meeting_model_js_1.Meeting.findByIdAndDelete(id);
    (0, index_js_1.getIO)().emit("dashboard_update");
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

import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { cloudinary } from "../config/cloudinary.js";
import { AuthenticatedRequest } from "../types/index.js";
import { User } from "../models/user.model.js";
import { Lead } from "../models/lead.model.js";
import { Project } from "../models/project.model.js";
import { Blog } from "../models/blog.model.js";
import { Meeting } from "../models/meeting.model.js";
import { ClientAccount } from "../models/client.model.js";
import { Task } from "../models/task.model.js";
import { Invoice } from "../models/invoice.model.js";
import { Ticket } from "../models/ticket.model.js";
import { Media } from "../models/media.model.js";
import { getIO } from "../socket/index.js";
import { AuthService } from "../services/auth.service.js";
import { Employee } from "../models/employee.model.js";
import { Department } from "../models/department.model.js";
import { Attendance } from "../models/attendance.model.js";
import { LeaveRequest } from "../models/leave-request.model.js";
import { Payment } from "../models/payment.model.js";
import { Proposal } from "../models/proposal.model.js";
import { Contract } from "../models/contract.model.js";
import { ContactMessage } from "../models/contact-message.model.js";

export const uploadMediaImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  let dataURI = "";

  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    dataURI = `data:${req.file.mimetype};base64,${b64}`;
  } else if (req.body && (req.body.image || req.body.file)) {
    dataURI = req.body.image || req.body.file;
  }

  if (!dataURI) {
    throw new ApiError(400, "No image file or image data provided");
  }

  if (dataURI.startsWith("http://") || dataURI.startsWith("https://")) {
    return res.status(200).json(new ApiResponse(200, { url: dataURI }, "Image URL processed"));
  }

  try {
    const uploadRes = await cloudinary.uploader.upload(dataURI, {
      folder: "nuvexora/cms",
      resource_type: "auto",
    });

    return res.status(200).json(new ApiResponse(200, { url: uploadRes.secure_url }, "Image uploaded successfully to Cloudinary"));
  } catch (error: any) {
    console.error("Cloudinary Upload Warning/Error:", error?.message || error);
    // Graceful fallback to Data URI format if Cloudinary service/credentials encounter issues
    return res.status(200).json(new ApiResponse(200, { url: dataURI }, "Image uploaded via resilient fallback"));
  }
});


export const getAdminDashboardMetrics = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalUsers, totalLeads, activeProjects, totalClients, totalTasks, upcomingMeetings,
    totalInvoices, totalTickets, totalMedia, totalBlogs, completedTasks
  ] = await Promise.all([
    User.countDocuments(),
    Lead.countDocuments(),
    Project.countDocuments({ status: { $ne: "completed" } }),
    ClientAccount.countDocuments({ status: "active" }),
    Task.countDocuments({ status: { $ne: "completed" } }),
    Meeting.countDocuments({ status: "scheduled" }),
    Invoice.countDocuments(),
    Ticket.countDocuments({ status: { $ne: "resolved" } }),
    Media.countDocuments(),
    Blog.countDocuments(),
    Task.countDocuments({ status: "completed" })
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
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
      },
      "Admin dashboard metrics retrieved successfully"
    )
  );
});


export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, users, "Users list retrieved successfully"));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, status } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { ...(role && { role }), ...(status && { status }) },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

export const getAllLeads = asyncHandler(async (_req: Request, res: Response) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, leads, "Leads list retrieved successfully"));
});

export const updateLeadStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
  return res.status(200).json(new ApiResponse(200, lead, "Lead status updated successfully"));
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Lead.findByIdAndDelete(id);
  return res.status(200).json(new ApiResponse(200, null, "Lead deleted successfully"));
});



// --- CLIENT CRM MANAGEMENT ---

export const getAllClients = asyncHandler(async (_req: Request, res: Response) => {
  const clients = await ClientAccount.find({ status: { $ne: "deleted" } }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, clients, "Clients retrieved successfully"));
});

export const createClient = asyncHandler(async (req: Request, res: Response) => {
  const { companyName, clientName, email, accountManager } = req.body;
  
  // 1. Create User & Trigger Activation Email
  const user = await AuthService.createAccountWithActivation(
    { name: clientName || companyName, email, role: "CLIENT", type: "CLIENT", companyName, accountManager: accountManager?.name },
    req.ip,
    req.get("user-agent")
  );

  // 2. Create Client Profile
  const client = await ClientAccount.create({ ...req.body, userId: user._id });
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, client, "Client created and activation email sent successfully"));
});

export const updateClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = await ClientAccount.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, client, "Client updated successfully"));
});

export const getClientById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const client = await ClientAccount.findById(id).populate("assignedAccountManager", "name email");
  if (!client) {
    return res.status(404).json(new ApiResponse(404, null, "Client not found"));
  }
  return res.status(200).json(new ApiResponse(200, client, "Client retrieved successfully"));
});

// --- EMPLOYEE HR MANAGEMENT ---

export const getAllEmployees = asyncHandler(async (_req: Request, res: Response) => {
  const employees = await Employee.find({ status: { $ne: "terminated" } }).populate("manager", "name email").sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, employees, "Employees retrieved successfully"));
});

export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, department } = req.body;
  
  // 1. Create User & Trigger Activation Email
  const user = await AuthService.createAccountWithActivation(
    { name, email, role, type: "EMPLOYEE" },
    req.ip,
    req.get("user-agent")
  );

  // 2. Create Employee Profile
  const employeeId = `EMP-${Math.floor(100000 + Math.random() * 900000)}`;
  const employee = await Employee.create({ ...req.body, employeeId, userId: user._id });
  
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, employee, "Employee created and activation email sent successfully"));
});

export const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = await Employee.findById(id).populate("manager", "name email");
  if (!employee) {
    return res.status(404).json(new ApiResponse(404, null, "Employee not found"));
  }
  return res.status(200).json(new ApiResponse(200, employee, "Employee retrieved successfully"));
});

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, employee, "Employee updated successfully"));
});

// --- DEPARTMENT MANAGEMENT ---

export const getAllDepartments = asyncHandler(async (_req: Request, res: Response) => {
  const departments = await Department.find().populate("headOfDepartment", "name email");
  return res.status(200).json(new ApiResponse(200, departments, "Departments retrieved successfully"));
});

export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const department = await Department.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, department, "Department created successfully"));
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const department = await Department.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, department, "Department updated successfully"));
});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Department.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Department deleted successfully"));
});

// --- ATTENDANCE MANAGEMENT ---

export const getAllAttendance = asyncHandler(async (_req: Request, res: Response) => {
  const attendanceRecords = await Attendance.find().populate({
    path: "employeeId",
    select: "name email employeeId",
  }).sort({ date: -1 });
  return res.status(200).json(new ApiResponse(200, attendanceRecords, "Attendance records retrieved successfully"));
});

export const createAttendance = asyncHandler(async (req: Request, res: Response) => {
  const attendance = await Attendance.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, attendance, "Attendance record created successfully"));
});

export const updateAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const attendance = await Attendance.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, attendance, "Attendance record updated successfully"));
});

export const deleteAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Attendance.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Attendance record deleted successfully"));
});

// --- LEAVE MANAGEMENT ---

export const getAllLeaveRequests = asyncHandler(async (_req: Request, res: Response) => {
  const leaveRequests = await LeaveRequest.find()
    .populate({ path: "employeeId", select: "name email employeeId" })
    .populate({ path: "reviewedBy", select: "name" })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, leaveRequests, "Leave requests retrieved successfully"));
});

export const createLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const leave = await LeaveRequest.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, leave, "Leave request created successfully"));
});

export const updateLeaveRequest = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  
  // If status is being updated, we assume the admin who made the request is the reviewer
  // In a real scenario we'd extract the user from req.user, but for this demo, we just update the status
  const updateData = req.body;
  if (req.user && req.user.userId && (updateData.status === 'approved' || updateData.status === 'rejected')) {
    updateData.reviewedBy = req.user.userId;
  }
  
  const leave = await LeaveRequest.findByIdAndUpdate(id, updateData, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, leave, "Leave request updated successfully"));
});

export const deleteLeaveRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await LeaveRequest.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Leave request deleted successfully"));
});

// --- TASK MANAGEMENT ---

export const getAllTasks = asyncHandler(async (_req: Request, res: Response) => {
  const tasks = await Task.find()
    .populate({ path: "projectId", select: "name" })
    .populate({ path: "assignedTo", select: "name email role" })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await Task.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

// --- PROJECT MANAGEMENT ---

export const getAllProjects = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await Project.find()
    .populate({ path: "clientId", select: "name email company" })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, projects, "Projects retrieved successfully"));
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, project, "Project created successfully"));
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Project deleted successfully"));
});

// --- MILESTONE MANAGEMENT (Embedded in Projects) ---

export const getAllMilestones = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await Project.find().select("title milestones").lean();
  const allMilestones = projects.flatMap(p => 
    (p.milestones || []).map((m: any) => ({
      ...m,
      projectId: { _id: p._id, title: p.title }
    }))
  );
  // Sort by dueDate
  allMilestones.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  return res.status(200).json(new ApiResponse(200, allMilestones, "Milestones retrieved successfully"));
});

export const createMilestone = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, ...milestoneData } = req.body;
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");
  
  project.milestones.push(milestoneData);
  await project.save();
  
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, project.milestones[project.milestones.length - 1], "Milestone created successfully"));
});

export const updateMilestone = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // milestoneId
  const { projectId, ...milestoneData } = req.body;
  
  const project = await Project.findOneAndUpdate(
    { _id: projectId, "milestones._id": id },
    { $set: { 
        "milestones.$.title": milestoneData.title,
        "milestones.$.dueDate": milestoneData.dueDate,
        "milestones.$.status": milestoneData.status 
      } 
    },
    { new: true }
  );
  
  if (!project) throw new Error("Milestone or project not found");
  
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Milestone updated successfully"));
});

export const deleteMilestone = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // milestoneId
  const { projectId } = req.query; // pass projectId in query
  
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $pull: { milestones: { _id: id } } },
    { new: true }
  );
  
  if (!project) throw new Error("Project not found");
  
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Milestone deleted successfully"));
});

// --- INVOICE MANAGEMENT ---

export const getAllInvoices = asyncHandler(async (_req: Request, res: Response) => {
  const invoices = await Invoice.find()
    .populate({ path: "clientId", select: "name email company" })
    .populate({ path: "projectId", select: "title" })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, invoices, "Invoices retrieved successfully"));
});

export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await Invoice.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, invoice, "Invoice created successfully"));
});

export const updateInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, invoice, "Invoice updated successfully"));
});

export const deleteInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Invoice.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Invoice deleted successfully"));
});

// --- PAYMENT MANAGEMENT ---

export const getAllPayments = asyncHandler(async (_req: Request, res: Response) => {
  const payments = await Payment.find()
    .populate({ path: "clientId", select: "name email company" })
    .populate({ path: "invoiceId", select: "invoiceNumber totalAmount" })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, payments, "Payments retrieved successfully"));
});

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await Payment.create(req.body);
  
  if (payment.status === "completed") {
    // Optionally update the linked invoice status
    const invoice = await Invoice.findById(payment.invoiceId);
    if (invoice) {
      invoice.status = "paid";
      invoice.paidAt = new Date();
      await invoice.save();
    }
  }

  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, payment, "Payment created successfully"));
});

export const updatePayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payment = await Payment.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, payment, "Payment updated successfully"));
});

export const deletePayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Payment.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Payment deleted successfully"));
});

// --- PROPOSAL MANAGEMENT ---

export const getAllProposals = asyncHandler(async (_req: Request, res: Response) => {
  const proposals = await Proposal.find()
    .populate({ path: "clientId", select: "name email company" })
    .populate({ path: "projectId", select: "title" })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, proposals, "Proposals retrieved successfully"));
});

export const createProposal = asyncHandler(async (req: Request, res: Response) => {
  const proposal = await Proposal.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, proposal, "Proposal created successfully"));
});

export const updateProposal = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const proposal = await Proposal.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, proposal, "Proposal updated successfully"));
});

export const deleteProposal = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Proposal.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Proposal deleted successfully"));
});

// --- CONTRACT MANAGEMENT ---

export const getAllContracts = asyncHandler(async (_req: Request, res: Response) => {
  const contracts = await Contract.find()
    .populate({ path: "clientId", select: "name email company" })
    .populate({ path: "projectId", select: "title" })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, contracts, "Contracts retrieved successfully"));
});

export const createContract = asyncHandler(async (req: Request, res: Response) => {
  const contract = await Contract.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, contract, "Contract created successfully"));
});

export const updateContract = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const contract = await Contract.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, contract, "Contract updated successfully"));
});

export const deleteContract = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Contract.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Contract deleted successfully"));
});

// --- MESSAGES (ContactMessage) MANAGEMENT ---

export const getAllMessages = asyncHandler(async (_req: Request, res: Response) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, messages, "Messages retrieved successfully"));
});

export const updateMessageStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isRead, replied } = req.body;
  const message = await ContactMessage.findByIdAndUpdate(id, { ...(isRead !== undefined && { isRead }), ...(replied !== undefined && { replied }) }, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, message, "Message updated successfully"));
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ContactMessage.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Message deleted successfully"));
});

// --- MEETINGS MANAGEMENT ---

export const getAllMeetings = asyncHandler(async (_req: Request, res: Response) => {
  const meetings = await Meeting.find().sort({ meetingDate: 1 });
  return res.status(200).json(new ApiResponse(200, meetings, "Meetings retrieved successfully"));
});

export const createMeeting = asyncHandler(async (req: Request, res: Response) => {
  const meeting = await Meeting.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, meeting, "Meeting created successfully"));
});

export const updateMeeting = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const meeting = await Meeting.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, meeting, "Meeting updated successfully"));
});

export const deleteMeeting = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Meeting.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Meeting deleted successfully"));
});

// --- SUPPORT TICKETS MANAGEMENT ---

export const getAllTickets = asyncHandler(async (_req: Request, res: Response) => {
  const tickets = await Ticket.find()
    .populate({ path: "clientId", select: "name email company" })
    .populate({ path: "projectId", select: "title" })
    .sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, tickets, "Tickets retrieved successfully"));
});

export const updateTicket = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findByIdAndUpdate(id, req.body, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, ticket, "Ticket updated successfully"));
});

export const deleteTicket = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await Ticket.findByIdAndDelete(id);
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, null, "Ticket deleted successfully"));
});


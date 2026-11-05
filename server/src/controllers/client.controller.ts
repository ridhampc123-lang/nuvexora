import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { Project } from "../models/project.model.js";
import { Invoice } from "../models/invoice.model.js";
import { Task } from "../models/task.model.js";
import { ClientAccount } from "../models/client.model.js";
import { AuthenticatedRequest } from "../types/index.js";
import { getIO } from "../socket/index.js";

export const findClientOrHeal = async (userId: any, email?: string) => {
  let client = await ClientAccount.findOne({ userId });
  if (!client && email) {
    client = await ClientAccount.findOne({ email: email.toLowerCase() });
    if (client) {
      client.userId = userId;
      if (!client.name) client.name = client.ownerName;
      if (!client.company) client.company = client.companyName;
      await client.save();
    }
  }
  return client;
};

export const getClientIds = (client: any, userId: any) => {
  const ids: any[] = [];
  if (client?._id) ids.push(client._id);
  if (client?.userId) ids.push(client.userId);
  if (userId) ids.push(userId);
  return ids;
};

export const getClientDashboardData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId);

  const [projects, invoices] = await Promise.all([
    Project.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 }),
    Invoice.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 }),
  ]);

  const projectIds = projects.map(p => p._id);
  const tasks = await Task.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 });

  // Calculate stats
  const activeProjectsCount = projects.filter(p => p.status !== "completed").length;
  const pendingTasksCount = tasks.filter(t => t.status !== "completed").length;
  const outstandingInvoices = invoices.filter(i => i.status !== "paid");
  const outstandingInvoicesTotal = outstandingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const primaryProject = projects[0]?.title || "No Active Project";
  const deliveryProgress = projects[0]?.progressPercentage || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        clientName: client?.ownerName || client?.name || req.user?.email || "Client",
        companyName: client?.companyName || client?.company || "Organization",
        primaryProject,
        deliveryProgress,
        projects,
        invoices,
        tasks,
        activeProjectsCount,
        pendingTasksCount,
        outstandingInvoicesTotal: `₹${outstandingInvoicesTotal.toLocaleString("en-IN")}`,
        contractValue: client?.contractValue || 0,
        slaUptimeTarget: client?.slaUptimeTarget || "99.9%",
        notes: client?.notes || "", 
      },
      "Client dashboard overview retrieved successfully"
    )
  );
});

export const getClientProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId);
  const projects = await Project.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, projects, "Client projects retrieved successfully"));
});

export const getClientTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId);
  const projects = await Project.find({ clientId: { $in: clientIds } });
  const projectIds = projects.map(p => p._id);
  const tasks = await Task.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, tasks, "Client tasks retrieved successfully"));
});

export const updateClientTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId);
  const projects = await Project.find({ clientId: { $in: clientIds } });
  const projectIds = projects.map(p => p._id.toString());

  const taskToUpdate = await Task.findById(id);
  if (!taskToUpdate) return res.status(404).json(new ApiResponse(404, null, "Task not found"));

  if (!projectIds.includes(taskToUpdate.projectId.toString())) {
    return res.status(403).json(new ApiResponse(403, null, "Unauthorized to update this task"));
  }

  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
  try {
    getIO().emit("dashboard_update");
  } catch {}

  return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

export const getClientInvoices = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId);
  const invoices = await Invoice.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, invoices, "Client invoices retrieved successfully"));
});

export const payClientInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId).map(cid => cid.toString());

  const invoiceToPay = await Invoice.findById(id);
  if (!invoiceToPay) return res.status(404).json(new ApiResponse(404, null, "Invoice not found"));

  if (!clientIds.includes(invoiceToPay.clientId.toString())) {
    return res.status(403).json(new ApiResponse(403, null, "Unauthorized to pay this invoice"));
  }

  const invoice = await Invoice.findByIdAndUpdate(id, { status: "paid" }, { new: true });
  try {
    getIO().emit("dashboard_update");
  } catch {}

  return res.status(200).json(new ApiResponse(200, invoice, "Invoice paid successfully"));
});

// --- CLIENT MEETINGS ---
export const getClientMeetings = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { Meeting } = await import("../models/meeting.model.js");
  const userId = req.user?.userId;
  const userEmail = req.user?.email?.toLowerCase();
  const client = await findClientOrHeal(userId, req.user?.email);

  const meetings = await Meeting.find({
    $or: [
      { organizerEmail: userEmail },
      { companyName: client?.companyName || client?.company },
    ],
  }).sort({ meetingDate: -1 });

  return res.status(200).json(new ApiResponse(200, meetings, "Client meetings retrieved successfully"));
});

export const scheduleClientMeeting = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { Meeting } = await import("../models/meeting.model.js");
  const { title, type, meetingDate, timeSlot, topic } = req.body;

  if (!title || !meetingDate) {
    throw new ApiError(400, "Title and meeting date are required");
  }

  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);

  const meeting = await Meeting.create({
    title,
    organizerName: client?.ownerName || client?.name || (req.user as any)?.name || "Client",
    organizerEmail: req.user?.email?.toLowerCase(),
    companyName: client?.companyName || client?.company || "Organization",
    meetingDate: new Date(meetingDate),
    timeSlot: timeSlot || "10:00 AM EST",
    topic: topic || type || "Strategy Consultation",
    status: "scheduled",
    meetingLink: "",
  });

  try {
    getIO().to("admin_room").emit("dashboard_update");
    getIO().to("admin_room").emit("new_meeting_scheduled", meeting);
  } catch {}

  return res.status(201).json(new ApiResponse(201, meeting, "Meeting scheduled successfully"));
});

// --- CLIENT SUPPORT TICKETS ---
export const getClientTickets = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { Ticket } = await import("../models/ticket.model.js");
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId);

  const tickets = await Ticket.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, tickets, "Client tickets retrieved successfully"));
});

export const createClientTicket = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { Ticket } = await import("../models/ticket.model.js");
  const { subject, category, priority, description } = req.body;

  if (!subject || !description) {
    throw new ApiError(400, "Subject and description are required");
  }

  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  if (!client) {
    throw new ApiError(404, "Client account profile not found");
  }

  const ticketNumber = `TICK-${Date.now().toString().slice(-6)}`;
  const ticket = await Ticket.create({
    ticketNumber,
    clientId: client._id,
    subject,
    category: (category || "technical").toLowerCase(),
    priority: (priority || "medium").toLowerCase(),
    description,
    status: "open",
  });

  try {
    getIO().to("admin_room").emit("dashboard_update");
    getIO().to("admin_room").emit("new_ticket_created", ticket);
  } catch {}

  return res.status(201).json(new ApiResponse(201, ticket, "Support ticket submitted successfully"));
});

// --- CLIENT APPROVALS / STAGE GATES ---
export const getClientApprovals = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { Contract } = await import("../models/contract.model.js");
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId);

  const [contracts, projects] = await Promise.all([
    Contract.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 }),
    Project.find({ clientId: { $in: clientIds } }),
  ]);

  const approvals: any[] = [];

  // 1. Add contracts requiring client signature / approval
  contracts.forEach((c) => {
    approvals.push({
      id: c._id.toString(),
      type: "Contract",
      title: c.title,
      description: c.content ? c.content.slice(0, 180) + "..." : "Master Services or Project Contract",
      status: c.status,
      value: c.value,
      date: c.createdAt,
      expiryDate: c.expiryDate,
    });
  });

  // 2. Add project milestones requiring review
  projects.forEach((p) => {
    (p.milestones || []).forEach((m: any) => {
      approvals.push({
        id: m._id ? m._id.toString() : `${p._id}-${m.title}`,
        projectId: p._id.toString(),
        type: "Milestone Deliverable",
        title: `${p.title}: ${m.title}`,
        description: `Deliverable sign-off for ${p.title} milestone.`,
        status: m.status,
        date: m.dueDate,
      });
    });
  });

  return res.status(200).json(new ApiResponse(200, approvals, "Approvals and stage gates retrieved successfully"));
});

export const approveClientDeliverable = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { Contract } = await import("../models/contract.model.js");
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId).map(cid => cid.toString());

  // Check if it's a contract
  const contract = await Contract.findById(id);
  if (contract) {
    if (!clientIds.includes(contract.clientId.toString())) {
      throw new ApiError(403, "Unauthorized to approve this contract");
    }
    contract.status = "signed";
    contract.signedDate = new Date();
    await contract.save();

    try {
      getIO().emit("dashboard_update");
    } catch {}

    return res.status(200).json(new ApiResponse(200, contract, "Contract signed and approved successfully"));
  }

  // Check if it's a milestone in one of the client's projects
  const project = await Project.findOne({
    clientId: { $in: clientIds },
    "milestones._id": id,
  });

  if (project) {
    const milestone = project.milestones.find((m: any) => m._id.toString() === id);
    if (milestone) {
      milestone.status = "completed";
      await project.save();
      try {
        getIO().emit("dashboard_update");
      } catch {}
      return res.status(200).json(new ApiResponse(200, milestone, "Milestone deliverable approved successfully"));
    }
  }

  return res.status(404).json(new ApiResponse(404, null, "Approval record not found"));
});

export const requestDeliverableChanges = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { comment, severity } = req.body;
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId).map(cid => cid.toString());

  // Record change request as a priority ticket or update deliverable
  const { Ticket } = await import("../models/ticket.model.js");
  if (!client) {
    throw new ApiError(404, "Client account not found");
  }

  const changeTicket = await Ticket.create({
    ticketNumber: `CR-${Date.now().toString().slice(-6)}`,
    clientId: client._id,
    subject: `Change Request for Deliverable [${id.slice(-6)}]`,
    category: "technical",
    priority: severity === "major" ? "urgent" : "medium",
    description: comment || "Client requested changes to deliverable.",
    status: "open",
  });

  try {
    getIO().to("admin_room").emit("dashboard_update");
    getIO().to("admin_room").emit("deliverable_changes_requested", { id, comment, severity, ticket: changeTicket });
  } catch {}

  return res.status(200).json(new ApiResponse(200, changeTicket, "Change request submitted to engineering team"));
});

// --- CLIENT ACCOUNT PROFILE / SETTINGS ---
export const getClientProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  return res.status(200).json(new ApiResponse(200, client, "Client profile retrieved successfully"));
});

export const updateClientProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { companyName, ownerName, phone, industry } = req.body;

  let client = await findClientOrHeal(userId, req.user?.email);
  if (!client) {
    throw new ApiError(404, "Client profile not found");
  }

  if (companyName) client.companyName = companyName;
  if (ownerName) client.ownerName = ownerName;
  if (phone) client.phone = phone;
  if (industry) client.industry = industry;

  await client.save();

  // Also update user display name if provided
  if (ownerName && userId) {
    const { User } = await import("../models/user.model.js");
    await User.findByIdAndUpdate(userId, { name: ownerName });
  }

  return res.status(200).json(new ApiResponse(200, client, "Client profile updated successfully"));
});

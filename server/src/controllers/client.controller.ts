import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { Project } from "../models/project.model.js";
import { Invoice } from "../models/invoice.model.js";
import { Task } from "../models/task.model.js";
import { ClientAccount } from "../models/client.model.js";
import { AuthenticatedRequest } from "../types/index.js";
import { getIO } from "../socket/index.js";

const findClientOrHeal = async (userId: any, email?: string) => {
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

export const getClientDashboardData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);

  if (!client) {
    return res.status(404).json(new ApiResponse(404, null, "Client profile not found"));
  }

  const clientId = client._id;

  const [projects, invoices] = await Promise.all([
    Project.find({ clientId }).sort({ createdAt: -1 }),
    Invoice.find({ clientId }).sort({ createdAt: -1 }),
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
        clientName: client.ownerName,
        companyName: client.companyName,
        primaryProject,
        deliveryProgress,
        projects,
        invoices,
        tasks,
        activeProjectsCount,
        pendingTasksCount,
        outstandingInvoicesTotal: `₹${outstandingInvoicesTotal.toLocaleString("en-IN")}`,
        contractValue: client.contractValue || 0,
        slaUptimeTarget: client.slaUptimeTarget,
        notes: client.notes, 
      },
      "Client dashboard overview retrieved successfully"
    )
  );
});

export const getClientProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  if (!client) return res.status(200).json(new ApiResponse(200, [], "Client not found"));
  const projects = await Project.find({ clientId: client._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, projects, "Client projects retrieved successfully"));
});

export const getClientTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  if (!client) return res.status(200).json(new ApiResponse(200, [], "Client not found"));
  const projects = await Project.find({ clientId: client._id });
  const projectIds = projects.map(p => p._id);
  const tasks = await Task.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, tasks, "Client tasks retrieved successfully"));
});

export const updateClientTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
  try {
    getIO().emit("dashboard_update");
  } catch {}

  return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

export const getClientInvoices = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const client = await findClientOrHeal(userId, req.user?.email);
  if (!client) return res.status(200).json(new ApiResponse(200, [], "Client not found"));
  const invoices = await Invoice.find({ clientId: client._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, invoices, "Client invoices retrieved successfully"));
});

export const payClientInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = await Invoice.findByIdAndUpdate(id, { status: "paid" }, { new: true });
  try {
    getIO().emit("dashboard_update");
  } catch {}

  return res.status(200).json(new ApiResponse(200, invoice, "Invoice paid successfully"));
});



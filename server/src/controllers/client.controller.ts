import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { Project } from "../models/project.model.js";
import { Invoice } from "../models/invoice.model.js";
import { Task } from "../models/task.model.js";

export const getClientDashboardData = asyncHandler(async (_req: Request, res: Response) => {
  const [projects, invoices, tasks] = await Promise.all([
    Project.find().sort({ createdAt: -1 }),
    Invoice.find().sort({ createdAt: -1 }),
    Task.find().sort({ createdAt: -1 }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        clientName: "Marcus Vance",
        companyName: "Veloce Financial",
        primaryProject: "Veloce Financial Banking Engine v4",
        deliveryProgress: 85,
        projects: projects.length > 0 ? projects : [
          { _id: "1", name: "Veloce Financial Banking Engine v4", progress: 85, status: "in_progress", deadline: "Aug 15, 2026" },
          { _id: "2", name: "Apex Healthcare Patient Portal", progress: 40, status: "in_progress", deadline: "Sep 30, 2026" }
        ],
        invoices: invoices.length > 0 ? invoices : [
          { _id: "inv-1", invoiceNumber: "INV-2026-089", amount: 12500, dueDate: "Aug 01, 2026", status: "pending" }
        ],
        tasks: tasks.length > 0 ? tasks : [
          { _id: "task-1", title: "Approve API v4 Schema Specs", status: "pending", priority: "high" },
          { _id: "task-2", title: "Review Sprint #14 Deliverables", status: "completed", priority: "medium" }
        ],
        activeProjectsCount: 2,
        pendingTasksCount: 6,
        outstandingInvoicesTotal: "$12,500",
      },
      "Client dashboard overview retrieved successfully"
    )
  );
});

export const getClientProjects = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, projects, "Client projects retrieved successfully"));
});

export const getClientTasks = asyncHandler(async (_req: Request, res: Response) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, tasks, "Client tasks retrieved successfully"));
});

export const updateClientTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
  return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

export const getClientInvoices = asyncHandler(async (_req: Request, res: Response) => {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, invoices, "Client invoices retrieved successfully"));
});

export const payClientInvoice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = await Invoice.findByIdAndUpdate(id, { status: "paid" }, { new: true });
  return res.status(200).json(new ApiResponse(200, invoice, "Invoice paid successfully"));
});


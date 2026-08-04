import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { Deal } from "../models/deal.model.js";
import { Employee } from "../models/employee.model.js";
import { Ticket } from "../models/ticket.model.js";
import { Invoice } from "../models/invoice.model.js";

import { getIO } from "../socket/index.js";

export const getDealsPipeline = asyncHandler(async (_req: Request, res: Response) => {
  const deals = await Deal.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, deals, "CRM deal pipeline retrieved successfully"));
});

export const createDeal = asyncHandler(async (req: Request, res: Response) => {
  const deal = await Deal.create(req.body);
  getIO().emit("dashboard_update");
  return res.status(201).json(new ApiResponse(201, deal, "Deal created successfully"));
});

export const updateDealStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stage, probability } = req.body;
  const deal = await Deal.findByIdAndUpdate(id, { stage, probability }, { new: true });
  getIO().emit("dashboard_update");
  return res.status(200).json(new ApiResponse(200, deal, "Deal updated successfully"));
});

export const getEmployees = asyncHandler(async (_req: Request, res: Response) => {
  const employees = await Employee.find().sort({ name: 1 });
  return res.status(200).json(new ApiResponse(200, employees, "HRMS employee directory retrieved successfully"));
});

export const getTickets = asyncHandler(async (_req: Request, res: Response) => {
  const tickets = await Ticket.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, tickets, "Support desk tickets retrieved successfully"));
});

export const getFinanceLedger = asyncHandler(async (_req: Request, res: Response) => {
  const invoices = await Invoice.find();
  const totalRevenue = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingRevenue = invoices.filter(i => i.status !== "paid").reduce((sum, i) => sum + i.totalAmount, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      { totalRevenue, pendingRevenue, invoicesCount: invoices.length },
      "Finance ledger metrics retrieved successfully"
    )
  );
});

export const generateAiContent = asyncHandler(async (req: Request, res: Response) => {
  const { prompt, type } = req.body;

  let generatedText = "";
  if (type === "proposal") {
    generatedText = `Nuvexora Technologies Commercial Proposal:\n\nObjective: ${prompt}\n\nTechnical Architecture:\n1. Cloud Engine Infrastructure\n2. AI Neural Inference Pipeline\n3. 99.999% SLA Guarantee\n\nEstimated Effort: 6 Sprints. Price: $48,000.`;
  } else if (type === "estimator") {
    generatedText = `Project Scope Estimate:\nFront-end: 120 hrs\nBackend REST APIs: 160 hrs\nDevOps & Staging: 40 hrs\nTotal Estimated Effort: 320 hours ($38,400).`;
  } else {
    generatedText = `Nuvexora AI Insight:\n${prompt}\n\nRecommended strategy: Deploy Next.js 16 micro-frontends backed by MongoDB Atlas sharded clusters.`;
  }

  return res.status(200).json(
    new ApiResponse(200, { generatedText, type }, "AI response generated successfully")
  );
});


import { Request, Response } from "express";
import { Lead } from "../models/lead.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone, company, serviceCategory, budgetRange, message } = req.body;

  const lead = await Lead.create({
    fullName,
    email,
    phone: phone || "",
    company: company || "",
    serviceCategory: serviceCategory || "General Inquiry",
    budgetRange: budgetRange || "Undisclosed",
    message,
  });

  return res.status(201).json(
    new ApiResponse(201, lead, "Lead inquiry submitted successfully. Our team will contact you shortly.")
  );
});

export const getLeads = asyncHandler(async (_req: Request, res: Response) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, leads, "Leads retrieved successfully"));
});

export const updateLeadStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
  if (!lead) {
    throw new ApiError(404, "Lead not found");
  }

  return res.status(200).json(new ApiResponse(200, lead, "Lead status updated successfully"));
});

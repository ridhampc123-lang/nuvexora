import { Request, Response } from "express";
import { CaseStudy } from "../models/case-study.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { AuthenticatedRequest } from "../types/index.js";

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

// --- PUBLIC CONTROLLERS ---

export const getPublicCaseStudies = asyncHandler(async (_req: Request, res: Response) => {
  const caseStudies = await CaseStudy.find({ status: "published" }).sort({ order: 1, createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, caseStudies, "Public case studies retrieved successfully"));
});

export const getPublicCaseStudyBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const caseStudy = await CaseStudy.findOne({ slug, status: "published" });

  if (!caseStudy) {
    throw new ApiError(404, "Case study not found");
  }

  return res.status(200).json(new ApiResponse(200, caseStudy, "Case study retrieved successfully"));
});

// --- ADMIN CONTROLLERS ---

export const getAdminCaseStudies = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const caseStudies = await CaseStudy.find().sort({ order: 1, createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, caseStudies, "Admin case studies retrieved successfully"));
});

export const createCaseStudy = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    slug: customSlug,
    client,
    industry,
    summary,
    challenge,
    solution,
    metrics,
    technologies,
    coverImage,
    deliverables,
    timeline,
    liveUrl,
    isFeatured,
    status,
    order,
  } = req.body;

  if (!title || !client || !industry) {
    throw new ApiError(400, "Title, Client Name, and Industry are required");
  }

  let finalSlug = customSlug ? generateSlug(customSlug) : generateSlug(title);
  if (!finalSlug) {
    finalSlug = "case-study-" + Date.now();
  }

  const existing = await CaseStudy.findOne({ slug: finalSlug });
  if (existing) {
    finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
  }

  const caseStudy = await CaseStudy.create({
    title,
    slug: finalSlug,
    client,
    industry,
    summary: summary || "",
    challenge: challenge || "",
    solution: solution || "",
    metrics: Array.isArray(metrics) ? metrics : [],
    technologies: Array.isArray(technologies) ? technologies : [],
    coverImage: coverImage || "",
    deliverables: Array.isArray(deliverables) ? deliverables : [],
    timeline: timeline || "4 - 8 Weeks",
    liveUrl: liveUrl || "",
    isFeatured: isFeatured !== undefined ? isFeatured : true,
    status: status || "published",
    order: order !== undefined ? Number(order) : 0,
  });

  return res.status(201).json(new ApiResponse(201, caseStudy, "Case study created successfully"));
});

export const updateCaseStudy = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.slug) {
    updates.slug = generateSlug(updates.slug);
    const existing = await CaseStudy.findOne({ slug: updates.slug, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(400, "A case study with this slug already exists");
    }
  }

  const caseStudy = await CaseStudy.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!caseStudy) {
    throw new ApiError(404, "Case study not found");
  }

  return res.status(200).json(new ApiResponse(200, caseStudy, "Case study updated successfully"));
});

export const deleteCaseStudy = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const caseStudy = await CaseStudy.findByIdAndDelete(id);

  if (!caseStudy) {
    throw new ApiError(404, "Case study not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Case study deleted successfully"));
});


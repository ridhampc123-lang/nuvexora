import { Response } from "express";
import { Portfolio } from "../models/portfolio.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { AuthenticatedRequest } from "../types/index.js";

export const getAdminPortfolio = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const items = await Portfolio.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, items, "Portfolio items retrieved successfully"));
});

export const createPortfolioItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { title, clientName, category, metric, metricLabel, summary, challenge, solution, results, techStack, coverImage, liveUrl, isFeatured } = req.body;

  if (!title || !clientName) {
    throw new ApiError(400, "Title and Client Name are required");
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now();

  const item = await Portfolio.create({
    title,
    slug,
    clientName,
    category: category || "General",
    metric: metric || "N/A",
    metricLabel: metricLabel || "Outcome",
    summary: summary || "Case study detailing client transformation.",
    challenge: challenge || "Overcoming legacy infrastructure limitations.",
    solution: solution || "Built custom cloud-native architecture.",
    results: results || "Significant increase in performance.",
    techStack: techStack || ["Next.js", "Node.js"],
    coverImage: coverImage || "",
    liveUrl: liveUrl || "",
    isFeatured: isFeatured !== undefined ? isFeatured : true,
  });

  return res.status(201).json(new ApiResponse(201, item, "Portfolio item created successfully"));
});

export const updatePortfolioItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const item = await Portfolio.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

  if (!item) {
    throw new ApiError(404, "Portfolio item not found");
  }

  return res.status(200).json(new ApiResponse(200, item, "Portfolio item updated successfully"));
});

export const deletePortfolioItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const item = await Portfolio.findByIdAndDelete(id);

  if (!item) {
    throw new ApiError(404, "Portfolio item not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Portfolio item deleted successfully"));
});

import { Request, Response } from "express";
import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { AuthenticatedRequest } from "../types/index.js";
import { getIO } from "../socket/index.js";
import { findClientOrHeal, getClientIds } from "./client.controller.js";

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { title, clientId, category, status, progressPercentage, techStack, estimatedCompletion } = req.body;

  const project = await Project.create({
    title,
    clientId,
    category,
    status: status || "discovery",
    progressPercentage: progressPercentage || 0,
    techStack: techStack || [],
    estimatedCompletion,
  });

  try {
    getIO().emit("dashboard_update");
  } catch {}

  return res.status(201).json(new ApiResponse(201, project, "Project created successfully"));
});

export const getClientProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  
  if (req.user?.role === "admin") {
    const projects = await Project.find().populate("clientId", "name email company").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, projects, "Projects retrieved successfully"));
  }

  const client = await findClientOrHeal(userId, req.user?.email);
  const clientIds = getClientIds(client, userId);

  const projects = await Project.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, projects, "Projects retrieved successfully"));
});

export const updateProjectProgress = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { progressPercentage, status } = req.body;

  const project = await Project.findByIdAndUpdate(
    id,
    { progressPercentage, status },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  try {
    getIO().emit("dashboard_update");
  } catch {}

  return res.status(200).json(new ApiResponse(200, project, "Project progress updated successfully"));
});

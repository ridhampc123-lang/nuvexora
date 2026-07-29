import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { Service } from "../models/service.model.js";

export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await Service.find().sort({ order: 1, createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, services, "Services retrieved successfully"));
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, "Service not found"));
  }
  return res.status(200).json(new ApiResponse(200, service, "Service retrieved successfully"));
});

export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const service = await Service.findOne({ slug: req.params.slug });
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, "Service not found"));
  }
  return res.status(200).json(new ApiResponse(200, service, "Service retrieved successfully"));
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const service = await Service.create(req.body);
  return res.status(201).json(new ApiResponse(201, service, "Service created successfully"));
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, "Service not found"));
  }
  return res.status(200).json(new ApiResponse(200, service, "Service updated successfully"));
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return res.status(404).json(new ApiResponse(404, null, "Service not found"));
  }
  return res.status(200).json(new ApiResponse(200, null, "Service deleted successfully"));
});

import { Request, Response } from "express";
import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const getAdminBlogs = asyncHandler(async (_req: Request, res: Response) => {
  const blogs = await Blog.find().sort({ publishedAt: -1 });
  return res.status(200).json(new ApiResponse(200, blogs, "Admin blogs retrieved successfully"));
});

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.create(req.body);
  return res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  if (!blog) throw new ApiError(404, "Blog not found");
  return res.status(200).json(new ApiResponse(200, blog, "Blog updated successfully"));
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new ApiError(404, "Blog not found");
  return res.status(200).json(new ApiResponse(200, null, "Blog deleted successfully"));
});

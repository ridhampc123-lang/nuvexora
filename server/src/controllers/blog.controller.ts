import { Request, Response } from "express";
import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const getBlogs = asyncHandler(async (_req: Request, res: Response) => {
  const blogs = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
  return res.status(200).json(new ApiResponse(200, blogs, "Blogs retrieved successfully"));
});

export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug, isPublished: true });
  if (!blog) {
    throw new ApiError(404, "Blog article not found");
  }
  return res.status(200).json(new ApiResponse(200, blog, "Blog article retrieved successfully"));
});

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const { title, slug, summary, content, category, tags, author, coverImage } = req.body;

  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    throw new ApiError(400, "Blog with this slug already exists");
  }

  const blog = await Blog.create({
    title,
    slug,
    summary,
    content,
    category,
    tags: tags || [],
    author: author || "Nuvexora Architecture Team",
    coverImage: coverImage || "",
  });

  return res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

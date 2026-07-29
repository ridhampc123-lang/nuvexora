"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = exports.getBlogBySlug = exports.getBlogs = void 0;
const blog_model_js_1 = require("../models/blog.model.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
exports.getBlogs = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const blogs = await blog_model_js_1.Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, blogs, "Blogs retrieved successfully"));
});
exports.getBlogBySlug = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    const blog = await blog_model_js_1.Blog.findOne({ slug, isPublished: true });
    if (!blog) {
        throw new api_error_js_1.ApiError(404, "Blog article not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, blog, "Blog article retrieved successfully"));
});
exports.createBlog = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { title, slug, summary, content, category, tags, author, coverImage } = req.body;
    const existingBlog = await blog_model_js_1.Blog.findOne({ slug });
    if (existingBlog) {
        throw new api_error_js_1.ApiError(400, "Blog with this slug already exists");
    }
    const blog = await blog_model_js_1.Blog.create({
        title,
        slug,
        summary,
        content,
        category,
        tags: tags || [],
        author: author || "Nuvexora Architecture Team",
        coverImage: coverImage || "",
    });
    return res.status(201).json(new api_response_js_1.ApiResponse(201, blog, "Blog created successfully"));
});

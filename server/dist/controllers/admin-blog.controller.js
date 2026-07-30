"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getAdminBlogs = void 0;
const blog_model_js_1 = require("../models/blog.model.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
exports.getAdminBlogs = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const blogs = await blog_model_js_1.Blog.find().sort({ publishedAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, blogs, "Admin blogs retrieved successfully"));
});
exports.createBlog = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const blog = await blog_model_js_1.Blog.create(req.body);
    return res.status(201).json(new api_response_js_1.ApiResponse(201, blog, "Blog created successfully"));
});
exports.updateBlog = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const blog = await blog_model_js_1.Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!blog)
        throw new api_error_js_1.ApiError(404, "Blog not found");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, blog, "Blog updated successfully"));
});
exports.deleteBlog = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const blog = await blog_model_js_1.Blog.findByIdAndDelete(id);
    if (!blog)
        throw new api_error_js_1.ApiError(404, "Blog not found");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Blog deleted successfully"));
});

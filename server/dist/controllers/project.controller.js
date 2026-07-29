"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectProgress = exports.getClientProjects = exports.createProject = void 0;
const project_model_js_1 = require("../models/project.model.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
exports.createProject = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { title, clientId, category, status, progressPercentage, techStack, estimatedCompletion } = req.body;
    const project = await project_model_js_1.Project.create({
        title,
        clientId,
        category,
        status: status || "discovery",
        progressPercentage: progressPercentage || 0,
        techStack: techStack || [],
        estimatedCompletion,
    });
    return res.status(201).json(new api_response_js_1.ApiResponse(201, project, "Project created successfully"));
});
exports.getClientProjects = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const projects = req.user?.role === "admin"
        ? await project_model_js_1.Project.find().populate("clientId", "name email company")
        : await project_model_js_1.Project.find({ clientId: userId });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, projects, "Projects retrieved successfully"));
});
exports.updateProjectProgress = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { progressPercentage, status } = req.body;
    const project = await project_model_js_1.Project.findByIdAndUpdate(id, { progressPercentage, status }, { new: true });
    if (!project) {
        throw new api_error_js_1.ApiError(404, "Project not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, project, "Project progress updated successfully"));
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectProgress = exports.getClientProjects = exports.createProject = void 0;
const project_model_js_1 = require("../models/project.model.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
const index_js_1 = require("../socket/index.js");
const client_controller_js_1 = require("./client.controller.js");
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
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(201).json(new api_response_js_1.ApiResponse(201, project, "Project created successfully"));
});
exports.getClientProjects = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    if (req.user?.role === "admin") {
        const projects = await project_model_js_1.Project.find().populate("clientId", "name email company").sort({ createdAt: -1 });
        return res.status(200).json(new api_response_js_1.ApiResponse(200, projects, "Projects retrieved successfully"));
    }
    const client = await (0, client_controller_js_1.findClientOrHeal)(userId, req.user?.email);
    const clientIds = (0, client_controller_js_1.getClientIds)(client, userId);
    const projects = await project_model_js_1.Project.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, projects, "Projects retrieved successfully"));
});
exports.updateProjectProgress = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { progressPercentage, status } = req.body;
    const project = await project_model_js_1.Project.findByIdAndUpdate(id, { progressPercentage, status }, { new: true });
    if (!project) {
        throw new api_error_js_1.ApiError(404, "Project not found");
    }
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, project, "Project progress updated successfully"));
});

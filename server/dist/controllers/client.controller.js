"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payClientInvoice = exports.getClientInvoices = exports.updateClientTask = exports.getClientTasks = exports.getClientProjects = exports.getClientDashboardData = void 0;
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const project_model_js_1 = require("../models/project.model.js");
const invoice_model_js_1 = require("../models/invoice.model.js");
const task_model_js_1 = require("../models/task.model.js");
exports.getClientDashboardData = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const [projects, invoices, tasks] = await Promise.all([
        project_model_js_1.Project.find().sort({ createdAt: -1 }),
        invoice_model_js_1.Invoice.find().sort({ createdAt: -1 }),
        task_model_js_1.Task.find().sort({ createdAt: -1 }),
    ]);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, {
        clientName: "Marcus Vance",
        companyName: "Veloce Financial",
        primaryProject: "Veloce Financial Banking Engine v4",
        deliveryProgress: 85,
        projects: projects.length > 0 ? projects : [
            { _id: "1", name: "Veloce Financial Banking Engine v4", progress: 85, status: "in_progress", deadline: "Aug 15, 2026" },
            { _id: "2", name: "Apex Healthcare Patient Portal", progress: 40, status: "in_progress", deadline: "Sep 30, 2026" }
        ],
        invoices: invoices.length > 0 ? invoices : [
            { _id: "inv-1", invoiceNumber: "INV-2026-089", amount: 12500, dueDate: "Aug 01, 2026", status: "pending" }
        ],
        tasks: tasks.length > 0 ? tasks : [
            { _id: "task-1", title: "Approve API v4 Schema Specs", status: "pending", priority: "high" },
            { _id: "task-2", title: "Review Sprint #14 Deliverables", status: "completed", priority: "medium" }
        ],
        activeProjectsCount: 2,
        pendingTasksCount: 6,
        outstandingInvoicesTotal: "$12,500",
    }, "Client dashboard overview retrieved successfully"));
});
exports.getClientProjects = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const projects = await project_model_js_1.Project.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, projects, "Client projects retrieved successfully"));
});
exports.getClientTasks = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const tasks = await task_model_js_1.Task.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, tasks, "Client tasks retrieved successfully"));
});
exports.updateClientTask = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const task = await task_model_js_1.Task.findByIdAndUpdate(id, { status }, { new: true });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, task, "Task updated successfully"));
});
exports.getClientInvoices = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const invoices = await invoice_model_js_1.Invoice.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, invoices, "Client invoices retrieved successfully"));
});
exports.payClientInvoice = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const invoice = await invoice_model_js_1.Invoice.findByIdAndUpdate(id, { status: "paid" }, { new: true });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, invoice, "Invoice paid successfully"));
});

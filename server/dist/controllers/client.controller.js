"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payClientInvoice = exports.getClientInvoices = exports.updateClientTask = exports.getClientTasks = exports.getClientProjects = exports.getClientDashboardData = exports.getClientIds = exports.findClientOrHeal = void 0;
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const project_model_js_1 = require("../models/project.model.js");
const invoice_model_js_1 = require("../models/invoice.model.js");
const task_model_js_1 = require("../models/task.model.js");
const client_model_js_1 = require("../models/client.model.js");
const index_js_1 = require("../socket/index.js");
const findClientOrHeal = async (userId, email) => {
    let client = await client_model_js_1.ClientAccount.findOne({ userId });
    if (!client && email) {
        client = await client_model_js_1.ClientAccount.findOne({ email: email.toLowerCase() });
        if (client) {
            client.userId = userId;
            if (!client.name)
                client.name = client.ownerName;
            if (!client.company)
                client.company = client.companyName;
            await client.save();
        }
    }
    return client;
};
exports.findClientOrHeal = findClientOrHeal;
const getClientIds = (client, userId) => {
    const ids = [];
    if (client?._id)
        ids.push(client._id);
    if (client?.userId)
        ids.push(client.userId);
    if (userId)
        ids.push(userId);
    return ids;
};
exports.getClientIds = getClientIds;
exports.getClientDashboardData = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const client = await (0, exports.findClientOrHeal)(userId, req.user?.email);
    const clientIds = (0, exports.getClientIds)(client, userId);
    const [projects, invoices] = await Promise.all([
        project_model_js_1.Project.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 }),
        invoice_model_js_1.Invoice.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 }),
    ]);
    const projectIds = projects.map(p => p._id);
    const tasks = await task_model_js_1.Task.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 });
    // Calculate stats
    const activeProjectsCount = projects.filter(p => p.status !== "completed").length;
    const pendingTasksCount = tasks.filter(t => t.status !== "completed").length;
    const outstandingInvoices = invoices.filter(i => i.status !== "paid");
    const outstandingInvoicesTotal = outstandingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const primaryProject = projects[0]?.title || "No Active Project";
    const deliveryProgress = projects[0]?.progressPercentage || 0;
    return res.status(200).json(new api_response_js_1.ApiResponse(200, {
        clientName: client?.ownerName || client?.name || req.user?.email || "Client",
        companyName: client?.companyName || client?.company || "Organization",
        primaryProject,
        deliveryProgress,
        projects,
        invoices,
        tasks,
        activeProjectsCount,
        pendingTasksCount,
        outstandingInvoicesTotal: `₹${outstandingInvoicesTotal.toLocaleString("en-IN")}`,
        contractValue: client?.contractValue || 0,
        slaUptimeTarget: client?.slaUptimeTarget || "99.9%",
        notes: client?.notes || "",
    }, "Client dashboard overview retrieved successfully"));
});
exports.getClientProjects = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const client = await (0, exports.findClientOrHeal)(userId, req.user?.email);
    const clientIds = (0, exports.getClientIds)(client, userId);
    const projects = await project_model_js_1.Project.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, projects, "Client projects retrieved successfully"));
});
exports.getClientTasks = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const client = await (0, exports.findClientOrHeal)(userId, req.user?.email);
    const clientIds = (0, exports.getClientIds)(client, userId);
    const projects = await project_model_js_1.Project.find({ clientId: { $in: clientIds } });
    const projectIds = projects.map(p => p._id);
    const tasks = await task_model_js_1.Task.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, tasks, "Client tasks retrieved successfully"));
});
exports.updateClientTask = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;
    const client = await (0, exports.findClientOrHeal)(userId, req.user?.email);
    const clientIds = (0, exports.getClientIds)(client, userId);
    const projects = await project_model_js_1.Project.find({ clientId: { $in: clientIds } });
    const projectIds = projects.map(p => p._id.toString());
    const taskToUpdate = await task_model_js_1.Task.findById(id);
    if (!taskToUpdate)
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Task not found"));
    if (!projectIds.includes(taskToUpdate.projectId.toString())) {
        return res.status(403).json(new api_response_js_1.ApiResponse(403, null, "Unauthorized to update this task"));
    }
    const task = await task_model_js_1.Task.findByIdAndUpdate(id, { status }, { new: true });
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, task, "Task updated successfully"));
});
exports.getClientInvoices = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const client = await (0, exports.findClientOrHeal)(userId, req.user?.email);
    const clientIds = (0, exports.getClientIds)(client, userId);
    const invoices = await invoice_model_js_1.Invoice.find({ clientId: { $in: clientIds } }).sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, invoices, "Client invoices retrieved successfully"));
});
exports.payClientInvoice = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const client = await (0, exports.findClientOrHeal)(userId, req.user?.email);
    const clientIds = (0, exports.getClientIds)(client, userId).map(cid => cid.toString());
    const invoiceToPay = await invoice_model_js_1.Invoice.findById(id);
    if (!invoiceToPay)
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Invoice not found"));
    if (!clientIds.includes(invoiceToPay.clientId.toString())) {
        return res.status(403).json(new api_response_js_1.ApiResponse(403, null, "Unauthorized to pay this invoice"));
    }
    const invoice = await invoice_model_js_1.Invoice.findByIdAndUpdate(id, { status: "paid" }, { new: true });
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, invoice, "Invoice paid successfully"));
});

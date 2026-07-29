"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAiContent = exports.getFinanceLedger = exports.getTickets = exports.getEmployees = exports.getDealsPipeline = void 0;
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const deal_model_js_1 = require("../models/deal.model.js");
const employee_model_js_1 = require("../models/employee.model.js");
const ticket_model_js_1 = require("../models/ticket.model.js");
const invoice_model_js_1 = require("../models/invoice.model.js");
exports.getDealsPipeline = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const deals = await deal_model_js_1.Deal.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, deals, "CRM deal pipeline retrieved successfully"));
});
exports.getEmployees = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const employees = await employee_model_js_1.Employee.find().sort({ name: 1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, employees, "HRMS employee directory retrieved successfully"));
});
exports.getTickets = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const tickets = await ticket_model_js_1.Ticket.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, tickets, "Support desk tickets retrieved successfully"));
});
exports.getFinanceLedger = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const invoices = await invoice_model_js_1.Invoice.find();
    const totalRevenue = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.totalAmount, 0);
    const pendingRevenue = invoices.filter(i => i.status !== "paid").reduce((sum, i) => sum + i.totalAmount, 0);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, { totalRevenue, pendingRevenue, invoicesCount: invoices.length }, "Finance ledger metrics retrieved successfully"));
});
exports.generateAiContent = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { prompt, type } = req.body;
    let generatedText = "";
    if (type === "proposal") {
        generatedText = `Nuvexora Technologies Commercial Proposal:\n\nObjective: ${prompt}\n\nTechnical Architecture:\n1. Cloud Engine Infrastructure\n2. AI Neural Inference Pipeline\n3. 99.999% SLA Guarantee\n\nEstimated Effort: 6 Sprints. Price: $48,000.`;
    }
    else if (type === "estimator") {
        generatedText = `Project Scope Estimate:\nFront-end: 120 hrs\nBackend REST APIs: 160 hrs\nDevOps & Staging: 40 hrs\nTotal Estimated Effort: 320 hours ($38,400).`;
    }
    else {
        generatedText = `Nuvexora AI Insight:\n${prompt}\n\nRecommended strategy: Deploy Next.js 15 micro-frontends backed by MongoDB Atlas sharded clusters.`;
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, { generatedText, type }, "AI response generated successfully"));
});

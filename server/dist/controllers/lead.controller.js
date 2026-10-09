"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLeadStatus = exports.getLeads = exports.createLead = void 0;
const lead_model_js_1 = require("../models/lead.model.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
const index_js_1 = require("../socket/index.js");
exports.createLead = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { fullName, email, phone, company, serviceCategory, budgetRange, timeline, message } = req.body;
    const lead = await lead_model_js_1.Lead.create({
        fullName,
        email,
        phone: phone || "",
        company: company || "",
        serviceCategory: serviceCategory || "General Inquiry",
        budgetRange: budgetRange || "Undisclosed",
        timeline: timeline || "Flexible",
        message,
    });
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
        (0, index_js_1.getIO)().emit("new_lead", lead);
    }
    catch (socketErr) {
        console.log("Socket emit warning:", socketErr);
    }
    return res.status(201).json(new api_response_js_1.ApiResponse(201, lead, "Lead inquiry submitted successfully. Our team will contact you shortly."));
});
exports.getLeads = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const leads = await lead_model_js_1.Lead.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, leads, "Leads retrieved successfully"));
});
exports.updateLeadStatus = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const lead = await lead_model_js_1.Lead.findByIdAndUpdate(id, { status }, { new: true });
    if (!lead) {
        throw new api_error_js_1.ApiError(404, "Lead not found");
    }
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, lead, "Lead status updated successfully"));
});
exports.deleteLead = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const lead = await lead_model_js_1.Lead.findByIdAndDelete(id);
    if (!lead) {
        throw new api_error_js_1.ApiError(404, "Lead not found");
    }
    try {
        (0, index_js_1.getIO)().emit("dashboard_update");
    }
    catch { }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Lead deleted successfully"));
});

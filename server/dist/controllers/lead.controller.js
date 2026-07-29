"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadStatus = exports.getLeads = exports.createLead = void 0;
const lead_model_js_1 = require("../models/lead.model.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
exports.createLead = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { fullName, email, phone, company, serviceCategory, budgetRange, message } = req.body;
    const lead = await lead_model_js_1.Lead.create({
        fullName,
        email,
        phone: phone || "",
        company: company || "",
        serviceCategory: serviceCategory || "General Inquiry",
        budgetRange: budgetRange || "Undisclosed",
        message,
    });
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
    return res.status(200).json(new api_response_js_1.ApiResponse(200, lead, "Lead status updated successfully"));
});

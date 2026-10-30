"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCaseStudy = exports.updateCaseStudy = exports.createCaseStudy = exports.getAdminCaseStudies = exports.getPublicCaseStudyBySlug = exports.getPublicCaseStudies = void 0;
const case_study_model_js_1 = require("../models/case-study.model.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_error_js_1 = require("../utils/api-error.js");
const api_response_js_1 = require("../utils/api-response.js");
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
};
// --- PUBLIC CONTROLLERS ---
exports.getPublicCaseStudies = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const caseStudies = await case_study_model_js_1.CaseStudy.find({ status: "published" }).sort({ order: 1, createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, caseStudies, "Public case studies retrieved successfully"));
});
exports.getPublicCaseStudyBySlug = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    const caseStudy = await case_study_model_js_1.CaseStudy.findOne({ slug, status: "published" });
    if (!caseStudy) {
        throw new api_error_js_1.ApiError(404, "Case study not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, caseStudy, "Case study retrieved successfully"));
});
// --- ADMIN CONTROLLERS ---
exports.getAdminCaseStudies = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const caseStudies = await case_study_model_js_1.CaseStudy.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, caseStudies, "Admin case studies retrieved successfully"));
});
exports.createCaseStudy = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { title, slug: customSlug, client, industry, summary, challenge, solution, metrics, technologies, coverImage, deliverables, timeline, liveUrl, isFeatured, status, order, } = req.body;
    if (!title || !client || !industry) {
        throw new api_error_js_1.ApiError(400, "Title, Client Name, and Industry are required");
    }
    let finalSlug = customSlug ? generateSlug(customSlug) : generateSlug(title);
    if (!finalSlug) {
        finalSlug = "case-study-" + Date.now();
    }
    const existing = await case_study_model_js_1.CaseStudy.findOne({ slug: finalSlug });
    if (existing) {
        finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }
    const caseStudy = await case_study_model_js_1.CaseStudy.create({
        title,
        slug: finalSlug,
        client,
        industry,
        summary: summary || "",
        challenge: challenge || "",
        solution: solution || "",
        metrics: Array.isArray(metrics) ? metrics : [],
        technologies: Array.isArray(technologies) ? technologies : [],
        coverImage: coverImage || "",
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        timeline: timeline || "4 - 8 Weeks",
        liveUrl: liveUrl || "",
        isFeatured: isFeatured !== undefined ? isFeatured : true,
        status: status || "published",
        order: order !== undefined ? Number(order) : 0,
    });
    return res.status(201).json(new api_response_js_1.ApiResponse(201, caseStudy, "Case study created successfully"));
});
exports.updateCaseStudy = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.slug) {
        updates.slug = generateSlug(updates.slug);
        const existing = await case_study_model_js_1.CaseStudy.findOne({ slug: updates.slug, _id: { $ne: id } });
        if (existing) {
            throw new api_error_js_1.ApiError(400, "A case study with this slug already exists");
        }
    }
    const caseStudy = await case_study_model_js_1.CaseStudy.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });
    if (!caseStudy) {
        throw new api_error_js_1.ApiError(404, "Case study not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, caseStudy, "Case study updated successfully"));
});
exports.deleteCaseStudy = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const caseStudy = await case_study_model_js_1.CaseStudy.findByIdAndDelete(id);
    if (!caseStudy) {
        throw new api_error_js_1.ApiError(404, "Case study not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Case study deleted successfully"));
});

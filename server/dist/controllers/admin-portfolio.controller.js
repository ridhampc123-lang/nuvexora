"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePortfolioItem = exports.updatePortfolioItem = exports.createPortfolioItem = exports.getAdminPortfolio = void 0;
const portfolio_model_js_1 = require("../models/portfolio.model.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_error_js_1 = require("../utils/api-error.js");
const api_response_js_1 = require("../utils/api-response.js");
exports.getAdminPortfolio = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const items = await portfolio_model_js_1.Portfolio.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, items, "Portfolio items retrieved successfully"));
});
exports.createPortfolioItem = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { title, clientName, category, metric, metricLabel, summary, challenge, solution, results, techStack, coverImage, liveUrl, isFeatured } = req.body;
    if (!title || !clientName) {
        throw new api_error_js_1.ApiError(400, "Title and Client Name are required");
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now();
    const item = await portfolio_model_js_1.Portfolio.create({
        title,
        slug,
        clientName,
        category: category || "General",
        metric: metric || "N/A",
        metricLabel: metricLabel || "Outcome",
        summary: summary || "Case study detailing client transformation.",
        challenge: challenge || "Overcoming legacy infrastructure limitations.",
        solution: solution || "Built custom cloud-native architecture.",
        results: results || "Significant increase in performance.",
        techStack: techStack || ["Next.js", "Node.js"],
        coverImage: coverImage || "",
        liveUrl: liveUrl || "",
        isFeatured: isFeatured !== undefined ? isFeatured : true,
    });
    return res.status(201).json(new api_response_js_1.ApiResponse(201, item, "Portfolio item created successfully"));
});
exports.updatePortfolioItem = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const item = await portfolio_model_js_1.Portfolio.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!item) {
        throw new api_error_js_1.ApiError(404, "Portfolio item not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, item, "Portfolio item updated successfully"));
});
exports.deletePortfolioItem = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const item = await portfolio_model_js_1.Portfolio.findByIdAndDelete(id);
    if (!item) {
        throw new api_error_js_1.ApiError(404, "Portfolio item not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Portfolio item deleted successfully"));
});

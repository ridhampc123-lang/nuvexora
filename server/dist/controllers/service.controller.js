"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getServiceBySlug = exports.getServiceById = exports.getAllServices = void 0;
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const service_model_js_1 = require("../models/service.model.js");
exports.getAllServices = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const services = await service_model_js_1.Service.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, services, "Services retrieved successfully"));
});
exports.getServiceById = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const service = await service_model_js_1.Service.findById(req.params.id);
    if (!service) {
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Service not found"));
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, service, "Service retrieved successfully"));
});
exports.getServiceBySlug = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const service = await service_model_js_1.Service.findOne({ slug: req.params.slug });
    if (!service) {
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Service not found"));
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, service, "Service retrieved successfully"));
});
exports.createService = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const service = await service_model_js_1.Service.create(req.body);
    return res.status(201).json(new api_response_js_1.ApiResponse(201, service, "Service created successfully"));
});
exports.updateService = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const service = await service_model_js_1.Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) {
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Service not found"));
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, service, "Service updated successfully"));
});
exports.deleteService = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const service = await service_model_js_1.Service.findByIdAndDelete(req.params.id);
    if (!service) {
        return res.status(404).json(new api_response_js_1.ApiResponse(404, null, "Service not found"));
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Service deleted successfully"));
});

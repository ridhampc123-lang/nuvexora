"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeNewsletter = exports.bookMeeting = exports.getPublicPortfolio = exports.getHomepageData = void 0;
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const service_model_js_1 = require("../models/service.model.js");
const portfolio_model_js_1 = require("../models/portfolio.model.js");
const testimonial_model_js_1 = require("../models/testimonial.model.js");
const faq_model_js_1 = require("../models/faq.model.js");
const meeting_model_js_1 = require("../models/meeting.model.js");
const subscriber_model_js_1 = require("../models/subscriber.model.js");
exports.getHomepageData = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const [services, portfolio, testimonials, faqs] = await Promise.all([
        service_model_js_1.Service.find({ isActive: true }).limit(6),
        portfolio_model_js_1.Portfolio.find({ isFeatured: true }).limit(3),
        testimonial_model_js_1.Testimonial.find({ isVerified: true }).limit(6),
        faq_model_js_1.FAQ.find({ isActive: true }).limit(6),
    ]);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, { services, portfolio, testimonials, faqs }, "Homepage metadata retrieved successfully"));
});
exports.getPublicPortfolio = (0, async_handler_js_1.asyncHandler)(async (_req, res) => {
    const items = await portfolio_model_js_1.Portfolio.find().sort({ createdAt: -1 });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, items, "Public portfolio retrieved successfully"));
});
exports.bookMeeting = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { organizerName, organizerEmail, companyName, meetingDate, timeSlot, topic } = req.body;
    const meeting = await meeting_model_js_1.Meeting.create({
        organizerName,
        organizerEmail,
        companyName: companyName || "",
        meetingDate,
        timeSlot,
        topic,
    });
    return res.status(201).json(new api_response_js_1.ApiResponse(201, meeting, "Technical consultation meeting scheduled successfully"));
});
exports.subscribeNewsletter = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const subscriber = await subscriber_model_js_1.Subscriber.findOneAndUpdate({ email }, { isSubscribed: true, subscribedAt: new Date() }, { upsert: true, new: true });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, subscriber, "Successfully subscribed to Nuvexora Insights newsletter"));
});

import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { Service } from "../models/service.model.js";
import { Portfolio } from "../models/portfolio.model.js";
import { Blog } from "../models/blog.model.js";
import { Testimonial } from "../models/testimonial.model.js";
import { FAQ } from "../models/faq.model.js";
import { Industry } from "../models/industry.model.js";
import { Technology } from "../models/technology.model.js";
import { Meeting } from "../models/meeting.model.js";
import { Subscriber } from "../models/subscriber.model.js";

export const getHomepageData = asyncHandler(async (_req: Request, res: Response) => {
  const [services, portfolio, testimonials, faqs] = await Promise.all([
    Service.find({ isActive: true }).limit(6),
    Portfolio.find({ isFeatured: true }).limit(3),
    Testimonial.find({ isVerified: true }).limit(6),
    FAQ.find({ isActive: true }).limit(6),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { services, portfolio, testimonials, faqs },
      "Homepage metadata retrieved successfully"
    )
  );
});

export const getPublicPortfolio = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Portfolio.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, items, "Public portfolio retrieved successfully"));
});

export const bookMeeting = asyncHandler(async (req: Request, res: Response) => {
  const { organizerName, organizerEmail, companyName, meetingDate, timeSlot, topic } = req.body;

  const meeting = await Meeting.create({
    organizerName,
    organizerEmail,
    companyName: companyName || "",
    meetingDate,
    timeSlot,
    topic,
  });

  return res.status(201).json(
    new ApiResponse(201, meeting, "Technical consultation meeting scheduled successfully")
  );
});

export const subscribeNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const subscriber = await Subscriber.findOneAndUpdate(
    { email },
    { isSubscribed: true, subscribedAt: new Date() },
    { upsert: true, new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, subscriber, "Successfully subscribed to Nuvexora Insights newsletter")
  );
});

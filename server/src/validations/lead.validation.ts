import { z } from "zod";

export const createLeadSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email address required"),
    phone: z.string().optional(),
    company: z.string().optional(),
    serviceCategory: z.string().optional(),
    budgetRange: z.string().optional(),
    timeline: z.string().optional(),
    message: z.string().min(3, "Message is required"),
  }),
});

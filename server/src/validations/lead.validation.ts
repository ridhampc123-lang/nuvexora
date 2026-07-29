import { z } from "zod";

export const createLeadSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email address required"),
    phone: z.string().optional(),
    company: z.string().optional(),
    serviceCategory: z.string().min(1, "Service category is required"),
    budgetRange: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
  }),
});

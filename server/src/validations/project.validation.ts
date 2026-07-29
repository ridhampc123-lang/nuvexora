import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title required"),
    clientId: z.string().min(1, "Client ID required"),
    category: z.string().min(1, "Category required"),
    status: z.enum(["discovery", "in_development", "qa_testing", "deployed", "completed"]).optional(),
    progressPercentage: z.number().min(0).max(100).optional(),
    techStack: z.array(z.string()).optional(),
  }),
});

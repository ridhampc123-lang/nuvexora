import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    slug: z.string().min(3, "Slug required"),
    summary: z.string().min(10, "Summary required"),
    content: z.string().min(20, "Content required"),
    category: z.string().min(1, "Category required"),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
  }),
});

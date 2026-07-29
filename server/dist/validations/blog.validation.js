"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogSchema = void 0;
const zod_1 = require("zod");
exports.createBlogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5, "Title must be at least 5 characters"),
        slug: zod_1.z.string().min(3, "Slug required"),
        summary: zod_1.z.string().min(10, "Summary required"),
        content: zod_1.z.string().min(20, "Content required"),
        category: zod_1.z.string().min(1, "Category required"),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        author: zod_1.z.string().optional(),
    }),
});

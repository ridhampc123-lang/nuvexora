"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, "Title required"),
        clientId: zod_1.z.string().min(1, "Client ID required"),
        category: zod_1.z.string().min(1, "Category required"),
        status: zod_1.z.enum(["discovery", "in_development", "qa_testing", "deployed", "completed"]).optional(),
        progressPercentage: zod_1.z.number().min(0).max(100).optional(),
        techStack: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});

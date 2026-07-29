"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLeadSchema = void 0;
const zod_1 = require("zod");
exports.createLeadSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2, "Full name is required"),
        email: zod_1.z.string().email("Valid email address required"),
        phone: zod_1.z.string().optional(),
        company: zod_1.z.string().optional(),
        serviceCategory: zod_1.z.string().min(1, "Service category is required"),
        budgetRange: zod_1.z.string().optional(),
        message: zod_1.z.string().min(10, "Message must be at least 10 characters"),
    }),
});

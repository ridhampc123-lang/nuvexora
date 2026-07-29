"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const EmployeeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    department: { type: String, required: true },
    role: { type: String, required: true },
    designation: { type: String, required: true },
    manager: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    employmentType: { type: String, enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"], default: "FULL_TIME" },
    salary: { type: Number, default: 0 },
    joiningDate: { type: Date, default: Date.now },
    experience: { type: String },
    skills: [{ type: String }],
    technologyStack: [{ type: String }],
    country: { type: String },
    address: { type: String },
    emergencyContact: { type: String },
    profileImage: { type: String },
    status: { type: String, enum: ["active", "on_leave", "terminated"], default: "active" },
    notes: { type: String },
    assignedProjects: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Project" }],
    assignedTasks: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });
exports.Employee = mongoose_1.default.model("Employee", EmployeeSchema);

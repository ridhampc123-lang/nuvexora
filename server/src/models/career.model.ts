import mongoose, { Schema, Document } from "mongoose";

export interface ICareer extends Document {
  title: string;
  department: string;
  location: string;
  type: "Full-Time" | "Part-Time" | "Contract" | "Remote";
  experienceLevel: string;
  salaryRange?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    location: { type: String, required: true, default: "Remote / Hybrid" },
    type: { type: String, enum: ["Full-Time", "Part-Time", "Contract", "Remote"], default: "Full-Time" },
    experienceLevel: { type: String, required: true, default: "Senior" },
    salaryRange: { type: String, default: "" },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Career = mongoose.model<ICareer>("Career", CareerSchema);

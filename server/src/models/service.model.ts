import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string;
  category: "ai" | "web" | "mobile" | "cloud" | "enterprise" | "design";
  shortDescription: string;
  fullDescription: string;
  icon: string;
  badge?: string;
  features: string[];
  technologies: string[];
  startingPrice?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["ai", "web", "mobile", "cloud", "enterprise", "design"],
    },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    icon: { type: String, default: "Code2" },
    badge: { type: String, default: "" },
    features: [{ type: String }],
    technologies: [{ type: String }],
    startingPrice: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>("Service", ServiceSchema);

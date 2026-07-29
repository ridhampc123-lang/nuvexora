import mongoose, { Schema, Document } from "mongoose";

export interface ITechnology extends Document {
  name: string;
  category: "frontend" | "backend" | "ai" | "cloud" | "mobile" | "database";
  badge: string;
  description: string;
  iconName?: string;
  docUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TechnologySchema = new Schema<ITechnology>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["frontend", "backend", "ai", "cloud", "mobile", "database"],
    },
    badge: { type: String, default: "Primary" },
    description: { type: String, required: true },
    iconName: { type: String, default: "" },
    docUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Technology = mongoose.model<ITechnology>("Technology", TechnologySchema);

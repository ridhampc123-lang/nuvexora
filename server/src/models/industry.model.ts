import mongoose, { Schema, Document } from "mongoose";

export interface IIndustry extends Document {
  title: string;
  slug: string;
  description: string;
  metric: string;
  iconName: string;
  gradientColor: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrySchema = new Schema<IIndustry>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    metric: { type: String, required: true },
    iconName: { type: String, default: "Building2" },
    gradientColor: { type: String, default: "from-blue-500/10 via-indigo-500/5 to-transparent" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Industry = mongoose.model<IIndustry>("Industry", IndustrySchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolio extends Document {
  title: string;
  slug: string;
  clientName: string;
  category: string;
  metric: string;
  metricLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  techStack: string[];
  coverImage: string;
  galleryImages: string[];
  liveUrl?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    clientName: { type: String, required: true },
    category: { type: String, required: true },
    metric: { type: String, required: true },
    metricLabel: { type: String, required: true },
    summary: { type: String, required: true },
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    results: { type: String, required: true },
    techStack: [{ type: String }],
    coverImage: { type: String, default: "" },
    galleryImages: [{ type: String }],
    liveUrl: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  metrics: string[];
  technologies: string[];
  coverImage: string;
  deliverables: string[];
  timeline: string;
  liveUrl: string;
  isFeatured: boolean;
  status: "published" | "draft";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStudySchema = new Schema<ICaseStudy>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    client: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    metrics: [{ type: String }],
    technologies: [{ type: String }],
    coverImage: { type: String, default: "" },
    deliverables: [{ type: String }],
    timeline: { type: String, default: "4 - 8 Weeks" },
    liveUrl: { type: String, default: "" },
    isFeatured: { type: Boolean, default: true },
    status: { type: String, enum: ["published", "draft"], default: "published" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CaseStudy = mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);


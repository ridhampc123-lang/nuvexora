import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAt?: Date;
  readTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, default: "Nuvexora Architecture Team" },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
    readTime: { type: String, default: "5 min read" },
  },
  { timestamps: true }
);

export const Blog = mongoose.model<IBlog>("Blog", BlogSchema);

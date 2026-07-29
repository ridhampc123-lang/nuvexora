import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  authorName: string;
  authorTitle: string;
  companyName: string;
  avatarUrl?: string;
  quote: string;
  rating: number;
  isVerified: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    authorName: { type: String, required: true, trim: true },
    authorTitle: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: "" },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isVerified: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

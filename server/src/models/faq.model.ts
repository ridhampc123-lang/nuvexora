import mongoose, { Schema, Document } from "mongoose";

export interface IFAQ extends Document {
  category: "engagement" | "tech" | "security" | "pricing";
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    category: {
      type: String,
      required: true,
      enum: ["engagement", "tech", "security", "pricing"],
      default: "engagement",
    },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FAQ = mongoose.model<IFAQ>("FAQ", FAQSchema);

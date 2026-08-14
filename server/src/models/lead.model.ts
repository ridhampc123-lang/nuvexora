import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceCategory: string;
  budgetRange?: string;
  timeline?: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  meetingLink?: string;
  meetingTime?: string;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    serviceCategory: { type: String, required: true, default: "General Inquiry" },
    budgetRange: { type: String, default: "Undisclosed" },
    timeline: { type: String, default: "Flexible" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "closed"],
      default: "new",
    },
    meetingLink: { type: String, default: "" },
    meetingTime: { type: String, default: "" },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);

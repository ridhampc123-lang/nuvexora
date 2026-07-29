import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  replied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    senderName: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, lowercase: true, trim: true },
    senderPhone: { type: String, default: "" },
    subject: { type: String, required: true, default: "General Inquiry" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IMeeting extends Document {
  title: string;
  organizerName: string;
  organizerEmail: string;
  companyName?: string;
  meetingDate: Date;
  timeSlot: string;
  timezone: string;
  topic: string;
  status: "scheduled" | "completed" | "cancelled";
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    title: { type: String, required: true, default: "Technical Strategy Consultation" },
    organizerName: { type: String, required: true, trim: true },
    organizerEmail: { type: String, required: true, lowercase: true, trim: true },
    companyName: { type: String, default: "" },
    meetingDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    timezone: { type: String, default: "UTC" },
    topic: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    meetingLink: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Meeting = mongoose.model<IMeeting>("Meeting", MeetingSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  ticketNumber: string;
  clientId: mongoose.Types.ObjectId;
  subject: string;
  category: "technical" | "billing" | "sales" | "general";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  description: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    ticketNumber: { type: String, required: true, unique: true },
    clientId: { type: Schema.Types.ObjectId, ref: "ClientAccount", required: true },
    subject: { type: String, required: true, trim: true },
    category: { type: String, enum: ["technical", "billing", "sales", "general"], default: "technical" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    description: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);

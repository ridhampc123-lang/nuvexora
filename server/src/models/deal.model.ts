import mongoose, { Schema, Document } from "mongoose";

export interface IDeal extends Document {
  title: string;
  clientName: string;
  value: number;
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  probability: number;
  assignedTo?: mongoose.Types.ObjectId;
  expectedCloseDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
  {
    title: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    value: { type: Number, required: true, default: 0 },
    stage: {
      type: String,
      enum: ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"],
      default: "prospecting",
    },
    probability: { type: Number, default: 50 },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    expectedCloseDate: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Deal = mongoose.model<IDeal>("Deal", DealSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IProposal extends Document {
  title: string;
  projectId?: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  amount: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil: Date;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProposalSchema = new Schema<IProposal>(
  {
    title: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    clientId: { type: Schema.Types.ObjectId, ref: "ClientAccount", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["draft", "sent", "accepted", "rejected"], default: "draft" },
    validUntil: { type: Date, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Proposal = mongoose.model<IProposal>("Proposal", ProposalSchema);

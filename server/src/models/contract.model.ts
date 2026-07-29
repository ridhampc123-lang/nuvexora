import mongoose, { Schema, Document } from "mongoose";

export interface IContract extends Document {
  title: string;
  clientId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  content: string;
  status: "draft" | "sent" | "signed" | "expired";
  value: number;
  signedDate?: Date;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContract>(
  {
    title: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    content: { type: String, required: true },
    status: { type: String, enum: ["draft", "sent", "signed", "expired"], default: "draft" },
    value: { type: Number, required: true },
    signedDate: { type: Date },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Contract = mongoose.model<IContract>("Contract", ContractSchema);

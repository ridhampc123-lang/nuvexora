import mongoose, { Schema, Document } from "mongoose";

export interface IClientAccount extends Document {
  userId?: mongoose.Types.ObjectId;
  companyName: string;
  ownerName: string;
  name?: string;
  company?: string;
  email: string;
  phone?: string;
  industry: string;
  address?: string;
  website?: string;
  gstNumber?: string;
  assignedAccountManager?: mongoose.Types.ObjectId;
  notes?: string;
  tier: "Startup" | "Scaleup" | "Enterprise";
  contractValue: number;
  slaUptimeTarget: string;
  status: "active" | "inactive" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const ClientAccountSchema = new Schema<IClientAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    companyName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true },
    name: { type: String, default: "" },
    company: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: "" },
    industry: { type: String, required: true },
    address: { type: String, default: "" },
    website: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
    assignedAccountManager: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, default: "" },
    tier: { type: String, enum: ["Startup", "Scaleup", "Enterprise"], default: "Scaleup" },
    contractValue: { type: Number, default: 0 },
    slaUptimeTarget: { type: String, default: "99.99%" },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
  { timestamps: true }
);

export const ClientAccount = mongoose.model<IClientAccount>("ClientAccount", ClientAccountSchema);

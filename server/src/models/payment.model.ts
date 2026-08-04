import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  invoiceId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: "stripe" | "bank_transfer" | "crypto" | "card";
  transactionId: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "ClientAccount", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["stripe", "bank_transfer", "crypto", "card"], default: "card" },
    transactionId: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  headOfDepartment: mongoose.Types.ObjectId; // References User or Employee
  budget: number;
  description?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    headOfDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    budget: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const Department = mongoose.model<IDepartment>("Department", departmentSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IPermission extends Document {
  name: string;
  code: string;
  module: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    module: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Permission = mongoose.model<IPermission>("Permission", PermissionSchema);

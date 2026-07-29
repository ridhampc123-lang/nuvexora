import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  name: string;
  code: "ADMIN" | "CLIENT" | "EDITOR" | "VIEWER";
  description?: string;
  permissions: mongoose.Types.ObjectId[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: "" },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>("Role", RoleSchema);

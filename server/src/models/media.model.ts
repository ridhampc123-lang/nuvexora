import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  bytes: number;
  folder: string;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    format: { type: String, required: true },
    bytes: { type: Number, required: true },
    folder: { type: String, default: "nuvexora" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Media = mongoose.model<IMedia>("Media", MediaSchema);

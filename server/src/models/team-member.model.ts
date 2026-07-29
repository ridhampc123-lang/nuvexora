import mongoose, { Schema, Document } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  department: string;
  bio: string;
  avatarUrl: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    bio: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    socials: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TeamMember = mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

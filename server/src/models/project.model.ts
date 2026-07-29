import mongoose, { Schema, Document } from "mongoose";

export interface IMilestone {
  title: string;
  dueDate: Date;
  status: "pending" | "in_progress" | "completed";
}

export interface IProject extends Document {
  title: string;
  clientId: mongoose.Types.ObjectId;
  category: string;
  status: "discovery" | "in_development" | "qa_testing" | "deployed" | "completed";
  progressPercentage: number;
  startDate: Date;
  estimatedCompletion: Date;
  milestones: IMilestone[];
  techStack: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
});

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["discovery", "in_development", "qa_testing", "deployed", "completed"],
      default: "discovery",
    },
    progressPercentage: { type: Number, min: 0, max: 100, default: 0 },
    startDate: { type: Date, default: Date.now },
    estimatedCompletion: { type: Date },
    milestones: [MilestoneSchema],
    techStack: [{ type: String }],
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  userId?: mongoose.Types.ObjectId;
  employeeId: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  designation: string; // was position
  manager?: mongoose.Types.ObjectId;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  salary: number;
  joiningDate: Date;
  experience?: string;
  skills: string[];
  technologyStack: string[];
  country?: string;
  address?: string;
  emergencyContact?: string;
  profileImage?: string;
  status: "active" | "on_leave" | "terminated";
  notes?: string;
  assignedProjects: mongoose.Types.ObjectId[];
  assignedTasks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    department: { type: String, required: true },
    role: { type: String, required: true },
    designation: { type: String, required: true },
    manager: { type: Schema.Types.ObjectId, ref: "User" },
    employmentType: { type: String, enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"], default: "FULL_TIME" },
    salary: { type: Number, default: 0 },
    joiningDate: { type: Date, default: Date.now },
    experience: { type: String },
    skills: [{ type: String }],
    technologyStack: [{ type: String }],
    country: { type: String },
    address: { type: String },
    emergencyContact: { type: String },
    profileImage: { type: String },
    status: { type: String, enum: ["active", "on_leave", "terminated"], default: "active" },
    notes: { type: String },
    assignedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    assignedTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

export const Employee = mongoose.model<IEmployee>("Employee", EmployeeSchema);

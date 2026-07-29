import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "DEVELOPER"
  | "DESIGNER"
  | "QA_ENGINEER"
  | "HR"
  | "SALES"
  | "MARKETING"
  | "FINANCE"
  | "EMPLOYEE"
  | "CLIENT"
  | "USER";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  language?: string;
  status: "active" | "deactivated" | "soft_deleted";
  isEmailVerified: boolean;
  failedLoginAttempts: number;
  lockUntil?: Date;
  permissionsOverride: string[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  activationToken?: string;
  activationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "DEVELOPER",
        "DESIGNER",
        "QA_ENGINEER",
        "HR",
        "SALES",
        "MARKETING",
        "FINANCE",
        "EMPLOYEE",
        "CLIENT",
        "USER",
      ],
      default: "EMPLOYEE",
    },
    avatar: { type: String, default: "" },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    timezone: { type: String, default: "UTC" },
    language: { type: String, default: "en" },
    status: {
      type: String,
      enum: ["active", "deactivated", "soft_deleted"],
      default: "active",
    },
    isEmailVerified: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    permissionsOverride: [{ type: String }],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    activationToken: { type: String, select: false },
    activationExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
};

export const User = mongoose.model<IUser>("User", UserSchema);

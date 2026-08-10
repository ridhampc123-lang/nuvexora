import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  breakTimeMinutes?: number;
  totalWorkingMinutes?: number;
  status: "present" | "late" | "absent" | "half_day";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date, default: Date.now },
    checkOut: { type: Date },
    breakTimeMinutes: { type: Number, default: 0 },
    totalWorkingMinutes: { type: Number, default: 0 },
    status: { type: String, enum: ["present", "late", "absent", "half_day"], default: "present" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model<IAttendance>("Attendance", AttendanceSchema);

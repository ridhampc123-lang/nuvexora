import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  status: "present" | "late" | "absent" | "half_day";
  createdAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date, default: Date.now },
    checkOut: { type: Date },
    status: { type: String, enum: ["present", "late", "absent", "half_day"], default: "present" },
  },
  { timestamps: true }
);

export const Attendance = mongoose.model<IAttendance>("Attendance", AttendanceSchema);

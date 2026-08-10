import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nuvexora";

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    console.log("🌱 Checking database seed requirements...");

    // 1. Seed Super Admin Account
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@nuvexora.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: "Nuvexora Super Admin",
        email: adminEmail,
        password: process.env.INITIAL_ADMIN_PASSWORD || "Admin@Nuvexora2026!",
        role: "SUPER_ADMIN",
        status: "active",
        jobTitle: "Chief Executive & Systems Admin",
        permissionsOverride: ["*"],
      });
      console.log(`✅ Default Super Admin created: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Super Admin account (${adminEmail}) already exists.`);
    }

    // 2. Seed Enterprise Demo Client
    const clientEmail = "client@nuvexora.com";
    const existingClient = await User.findOne({ email: clientEmail });

    if (!existingClient) {
      const createdUser = await User.create({
        name: "Marcus Vance",
        email: clientEmail,
        password: "Client@2026!",
        role: "CLIENT",
        status: "active",
        companyName: "Veloce Financial",
        jobTitle: "CTO",
      });
      console.log(`✅ Default Client created: ${clientEmail}`);

      const { ClientAccount } = await import("../models/client.model.js");
      await ClientAccount.create({
        userId: createdUser._id,
        companyName: "Veloce Financial",
        ownerName: "Marcus Vance",
        email: clientEmail,
        industry: "FinTech & Banking",
        tier: "Enterprise",
        contractValue: 1500000,
        slaUptimeTarget: "99.99%",
        status: "active",
      });
      console.log(`✅ Default ClientAccount created with contractValue ₹15,00,000: ${clientEmail}`);
    } else {
      const { ClientAccount } = await import("../models/client.model.js");
      let ca = await ClientAccount.findOne({ email: clientEmail });
      if (!ca) {
        await ClientAccount.create({
          userId: existingClient._id,
          companyName: "Veloce Financial",
          ownerName: "Marcus Vance",
          email: clientEmail,
          industry: "FinTech & Banking",
          tier: "Enterprise",
          contractValue: 1500000,
          slaUptimeTarget: "99.99%",
          status: "active",
        });
        console.log(`✅ Linked missing ClientAccount for: ${clientEmail}`);
      } else if (!ca.contractValue || ca.contractValue === 0) {
        ca.contractValue = 1500000;
        await ca.save();
        console.log(`✅ Updated contractValue for ${clientEmail} to ₹15,00,000`);
      }
    }

    // 3. Seed Enterprise Demo Employee & Employee Document
    const employeeEmail = "employee@nuvexora.com";
    let existingEmployeeUser = await User.findOne({ email: employeeEmail });

    if (!existingEmployeeUser) {
      existingEmployeeUser = await User.create({
        name: "Alexander Vance",
        email: employeeEmail,
        password: "Employee@2026!",
        role: "EMPLOYEE",
        status: "active",
        department: "Engineering",
        jobTitle: "Lead Systems Architect",
      });
      console.log(`✅ Default Employee User created: ${employeeEmail}`);
    }

    const { Employee: EmployeeModel } = await import("../models/employee.model.js");
    let employeeDoc = await EmployeeModel.findOne({ email: employeeEmail });
    if (!employeeDoc) {
      employeeDoc = await EmployeeModel.create({
        userId: existingEmployeeUser._id,
        employeeId: "EMP-1001",
        name: "Alexander Vance",
        email: employeeEmail,
        department: "Engineering",
        role: "Lead Systems Architect",
        designation: "Principal Architect",
        employmentType: "FULL_TIME",
        status: "active",
      });
      console.log(`✅ Default Employee Document created (EMP-1001): ${employeeEmail}`);
    } else if (!employeeDoc.userId) {
      employeeDoc.userId = existingEmployeeUser._id;
      await employeeDoc.save();
    }

    // 4. Seed Initial Attendance Records if empty
    const { Attendance: AttendanceModel } = await import("../models/attendance.model.js");
    const countAttendance = await AttendanceModel.countDocuments();
    if (countAttendance === 0 && employeeDoc) {
      const today = new Date();
      const recordsToSeed = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);

        // Skip weekends
        if (d.getDay() === 0 || d.getDay() === 6) continue;

        const checkIn = new Date(d);
        checkIn.setHours(9, 0 + Math.floor(Math.random() * 15), 0);

        const checkOut = new Date(d);
        checkOut.setHours(17, 30 + Math.floor(Math.random() * 30), 0);

        const totalMins = Math.round((checkOut.getTime() - checkIn.getTime()) / 60000);

        recordsToSeed.push({
          employeeId: employeeDoc._id,
          date: d,
          checkIn,
          checkOut: i === 0 ? undefined : checkOut, // If today, keep shift active for check-out demonstration
          totalWorkingMinutes: i === 0 ? 0 : totalMins,
          status: i === 2 ? "late" : "present",
        });
      }

      if (recordsToSeed.length > 0) {
        await AttendanceModel.insertMany(recordsToSeed);
        console.log(`✅ Seeded ${recordsToSeed.length} attendance records for EMP-1001`);
      }
    }

    console.log("✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding error:", error);
  }
};

// Execute directly if run via CLI
if (process.argv[1]?.endsWith("seed.ts")) {
  seedDatabase().then(() => process.exit(0));
}

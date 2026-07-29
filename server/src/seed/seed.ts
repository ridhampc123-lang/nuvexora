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
      await User.create({
        name: "Marcus Vance",
        email: clientEmail,
        password: "Client@2026!",
        role: "CLIENT",
        status: "active",
        companyName: "Veloce Financial",
        jobTitle: "CTO",
      });
      console.log(`✅ Default Client created: ${clientEmail}`);
    }

    // 3. Seed Enterprise Demo Employee
    const employeeEmail = "employee@nuvexora.com";
    const existingEmployee = await User.findOne({ email: employeeEmail });

    if (!existingEmployee) {
      await User.create({
        name: "Alexander Vance",
        email: employeeEmail,
        password: "Employee@2026!",
        role: "EMPLOYEE",
        status: "active",
        department: "Engineering",
        jobTitle: "Lead Systems Architect",
      });
      console.log(`✅ Default Employee created: ${employeeEmail}`);
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

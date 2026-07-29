"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_js_1 = require("../models/user.model.js");
dotenv_1.default.config();
const seedDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nuvexora";
        if (mongoose_1.default.connection.readyState === 0) {
            await mongoose_1.default.connect(mongoUri);
        }
        console.log("🌱 Checking database seed requirements...");
        // 1. Seed Super Admin Account
        const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@nuvexora.com";
        const existingAdmin = await user_model_js_1.User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            await user_model_js_1.User.create({
                name: "Nuvexora Super Admin",
                email: adminEmail,
                password: process.env.INITIAL_ADMIN_PASSWORD || "Admin@Nuvexora2026!",
                role: "SUPER_ADMIN",
                status: "active",
                jobTitle: "Chief Executive & Systems Admin",
                permissionsOverride: ["*"],
            });
            console.log(`✅ Default Super Admin created: ${adminEmail}`);
        }
        else {
            console.log(`ℹ️ Super Admin account (${adminEmail}) already exists.`);
        }
        // 2. Seed Enterprise Demo Client
        const clientEmail = "client@nuvexora.com";
        const existingClient = await user_model_js_1.User.findOne({ email: clientEmail });
        if (!existingClient) {
            await user_model_js_1.User.create({
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
        const existingEmployee = await user_model_js_1.User.findOne({ email: employeeEmail });
        if (!existingEmployee) {
            await user_model_js_1.User.create({
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
    }
    catch (error) {
        console.error("❌ Database seeding error:", error);
    }
};
exports.seedDatabase = seedDatabase;
// Execute directly if run via CLI
if (process.argv[1]?.endsWith("seed.ts")) {
    (0, exports.seedDatabase)().then(() => process.exit(0));
}

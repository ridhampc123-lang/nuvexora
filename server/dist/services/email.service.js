"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendClientWelcomeEmail = exports.sendWelcomeEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendEmail = async ({ to, subject, html, }) => {
    try {
        if (!process.env.SMTP_USER) {
            console.log(`[Email Mock Service] Email to ${to} with subject "${subject}" logged.`);
            return;
        }
        await transporter.sendMail({
            from: process.env.SMTP_FROM || "Nuvexora Technologies <no-reply@nuvexora.com>",
            to,
            subject,
            html,
        });
        console.log(`[Email Service] Email sent successfully to ${to}`);
    }
    catch (error) {
        console.error(`[Email Error] Failed to send email to ${to}:`, error);
    }
};
exports.sendEmail = sendEmail;
const sendWelcomeEmail = async (email, name, activationUrl) => {
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f172a;">Welcome to Nuvexora Technologies</h2>
      <p style="color: #475569; font-size: 16px;">Hello ${name},</p>
      <p style="color: #475569; font-size: 16px;">Your employee portal account has been successfully created. We are thrilled to have you onboard.</p>
      <p style="color: #475569; font-size: 16px;">Please activate your account and securely set your password by clicking the button below. This activation link expires in 24 hours.</p>
      <a href="${activationUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px; margin-bottom: 20px;">Activate Your Account</a>
      <p style="color: #475569; font-size: 14px;">If you have any questions, please contact our IT support team.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 30px;">
      <p style="color: #94a3b8; font-size: 12px;">&copy; ${new Date().getFullYear()} Nuvexora Technologies. All rights reserved.</p>
    </div>
  `;
    await (0, exports.sendEmail)({ to: email, subject: "Welcome to Nuvexora - Activate Your Account", html });
};
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendClientWelcomeEmail = async (email, name, accountManager, activationUrl) => {
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f172a;">Welcome to Nuvexora Client Portal</h2>
      <p style="color: #475569; font-size: 16px;">Hello ${name},</p>
      <p style="color: #475569; font-size: 16px;">We are excited to partner with you. Your secure Client Portal account has been created.</p>
      <p style="color: #475569; font-size: 16px;">Your dedicated Account Manager is <strong>${accountManager}</strong>.</p>
      <p style="color: #475569; font-size: 16px;">To access your project updates, files, and invoices, please activate your account and set your password by clicking the button below. This link expires in 24 hours.</p>
      <a href="${activationUrl}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px; margin-bottom: 20px;">Activate Client Portal</a>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 30px;">
      <p style="color: #94a3b8; font-size: 12px;">&copy; ${new Date().getFullYear()} Nuvexora Technologies. All rights reserved.</p>
    </div>
  `;
    await (0, exports.sendEmail)({ to: email, subject: "Welcome to Nuvexora - Client Portal Access", html });
};
exports.sendClientWelcomeEmail = sendClientWelcomeEmail;

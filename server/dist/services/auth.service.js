"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_js_1 = require("../models/user.model.js");
const refresh_token_model_js_1 = require("../models/refresh-token.model.js");
const audit_log_model_js_1 = require("../models/audit-log.model.js");
const api_error_js_1 = require("../utils/api-error.js");
const jwt_helper_js_1 = require("../helpers/jwt.helper.js");
const email_service_js_1 = require("./email.service.js");
class AuthService {
    static async register(userData, ipAddress = "127.0.0.1", userAgent = "Unknown") {
        const existingUser = await user_model_js_1.User.findOne({ email: userData.email.toLowerCase() });
        if (existingUser) {
            throw new api_error_js_1.ApiError(400, "An account with this email address already exists");
        }
        const user = await user_model_js_1.User.create({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role || "USER",
            company: userData.company || "",
            phone: userData.phone || "",
            status: "active",
        });
        await audit_log_model_js_1.AuditLog.create({
            userId: user._id,
            action: "USER_REGISTERED",
            ipAddress,
            userAgent,
            details: { email: user.email, role: user.role },
        });
        const accessToken = (0, jwt_helper_js_1.generateAccessToken)({ userId: user._id, email: user.email, role: user.role });
        const refreshToken = (0, jwt_helper_js_1.generateRefreshToken)({ userId: user._id });
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await refresh_token_model_js_1.RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            ipAddress,
            userAgent,
            expiresAt,
        });
        return { user, accessToken, refreshToken };
    }
    static async login(credentials, ipAddress = "127.0.0.1", userAgent = "Unknown") {
        const user = await user_model_js_1.User.findOne({ email: credentials.email.toLowerCase() }).select("+password");
        if (!user) {
            throw new api_error_js_1.ApiError(401, "Invalid email or password");
        }
        if (user.status !== "active") {
            throw new api_error_js_1.ApiError(403, "Account is deactivated or suspended. Please contact support.");
        }
        if (user.isLocked()) {
            throw new api_error_js_1.ApiError(423, "Account temporarily locked due to consecutive failed login attempts. Try again in 15 minutes.");
        }
        const isMatch = await user.comparePassword(credentials.password);
        if (!isMatch) {
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= 5) {
                user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
            }
            await user.save();
            await audit_log_model_js_1.AuditLog.create({
                userId: user._id,
                action: "LOGIN_FAILED",
                ipAddress,
                userAgent,
                details: { attempts: user.failedLoginAttempts },
            });
            throw new api_error_js_1.ApiError(401, "Invalid email or password");
        }
        // Reset failed login attempts on successful login
        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();
        const accessToken = (0, jwt_helper_js_1.generateAccessToken)({ userId: user._id, email: user.email, role: user.role });
        const refreshToken = (0, jwt_helper_js_1.generateRefreshToken)({ userId: user._id });
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await refresh_token_model_js_1.RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            ipAddress,
            userAgent,
            expiresAt,
        });
        await audit_log_model_js_1.AuditLog.create({
            userId: user._id,
            action: "LOGIN_SUCCESS",
            ipAddress,
            userAgent,
        });
        const userPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            company: user.company,
            permissions: user.permissionsOverride,
        };
        return { user: userPayload, accessToken, refreshToken };
    }
    static async refreshTokens(incomingRefreshToken, ipAddress = "127.0.0.1", userAgent = "Unknown") {
        if (!incomingRefreshToken) {
            throw new api_error_js_1.ApiError(401, "Refresh token missing");
        }
        const tokenDoc = await refresh_token_model_js_1.RefreshToken.findOne({ token: incomingRefreshToken, isRevoked: false });
        if (!tokenDoc) {
            throw new api_error_js_1.ApiError(401, "Invalid or revoked refresh token");
        }
        const user = await user_model_js_1.User.findById(tokenDoc.userId);
        if (!user || user.status !== "active") {
            throw new api_error_js_1.ApiError(401, "User no longer active");
        }
        // Revoke old refresh token (Token Rotation)
        tokenDoc.isRevoked = true;
        await tokenDoc.save();
        // Generate new token pair
        const newAccessToken = (0, jwt_helper_js_1.generateAccessToken)({ userId: user._id, email: user.email, role: user.role });
        const newRefreshToken = (0, jwt_helper_js_1.generateRefreshToken)({ userId: user._id });
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await refresh_token_model_js_1.RefreshToken.create({
            userId: user._id,
            token: newRefreshToken,
            ipAddress,
            userAgent,
            expiresAt,
        });
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    static async logout(refreshToken, userId) {
        if (refreshToken) {
            await refresh_token_model_js_1.RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
        }
        if (userId) {
            await audit_log_model_js_1.AuditLog.create({
                userId: userId,
                action: "LOGOUT",
                ipAddress: "127.0.0.1",
                userAgent: "Unknown",
            });
        }
    }
    static async forgotPassword(email) {
        const user = await user_model_js_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Return gracefully to prevent email enumeration
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
        await (0, email_service_js_1.sendEmail)({
            to: user.email,
            subject: "Nuvexora Technologies — Password Reset Request",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your Nuvexora Technologies account.</p>
          <p>Click the link below to set a new password. This link is valid for 60 minutes:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px;">Reset Password</a>
          <p style="margin-top: 20px; color: #666;">If you did not request this, please ignore this email.</p>
        </div>
      `,
        });
    }
    static async resetPassword(resetToken, newPassword) {
        const hashedToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
        const user = await user_model_js_1.User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        }).select("+password");
        if (!user) {
            throw new api_error_js_1.ApiError(400, "Password reset token is invalid or has expired");
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();
        // Revoke all active refresh sessions for security
        await refresh_token_model_js_1.RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });
        await audit_log_model_js_1.AuditLog.create({
            userId: user._id,
            action: "PASSWORD_RESET_SUCCESS",
            ipAddress: "127.0.0.1",
            userAgent: "Unknown",
        });
    }
    static async createAccountWithActivation(userData, ipAddress = "127.0.0.1", userAgent = "Unknown") {
        const existingUser = await user_model_js_1.User.findOne({ email: userData.email.toLowerCase() });
        if (existingUser) {
            throw new api_error_js_1.ApiError(400, "An account with this email address already exists");
        }
        const activationToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = crypto_1.default.createHash("sha256").update(activationToken).digest("hex");
        const user = await user_model_js_1.User.create({
            name: userData.name,
            email: userData.email,
            password: crypto_1.default.randomBytes(32).toString("hex"), // temporary random password, never used
            role: userData.role,
            status: "active",
            activationToken: hashedToken,
            activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });
        await audit_log_model_js_1.AuditLog.create({
            userId: user._id,
            action: "ACCOUNT_PROVISIONED",
            ipAddress,
            userAgent,
            details: { email: user.email, role: user.role },
        });
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        const activationUrl = `${clientUrl}/activate?token=${activationToken}`;
        if (userData.type === "CLIENT") {
            await (0, email_service_js_1.sendClientWelcomeEmail)(user.email, user.name, userData.accountManager || "Our Team", activationUrl);
        }
        else {
            await (0, email_service_js_1.sendWelcomeEmail)(user.email, user.name, activationUrl);
        }
        return user;
    }
    static async activateAccount(activationToken, newPassword, ipAddress = "127.0.0.1", userAgent = "Unknown") {
        const hashedToken = crypto_1.default.createHash("sha256").update(activationToken).digest("hex");
        const user = await user_model_js_1.User.findOne({
            activationToken: hashedToken,
            activationExpires: { $gt: new Date() },
        }).select("+password");
        if (!user) {
            throw new api_error_js_1.ApiError(400, "Activation token is invalid or has expired");
        }
        user.password = newPassword;
        user.activationToken = undefined;
        user.activationExpires = undefined;
        user.isEmailVerified = true;
        await user.save();
        await audit_log_model_js_1.AuditLog.create({
            userId: user._id,
            action: "ACCOUNT_ACTIVATED",
            ipAddress,
            userAgent,
        });
        // Generate tokens for automatic login
        const accessToken = (0, jwt_helper_js_1.generateAccessToken)({ userId: user._id, email: user.email, role: user.role });
        const refreshToken = (0, jwt_helper_js_1.generateRefreshToken)({ userId: user._id });
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await refresh_token_model_js_1.RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            ipAddress,
            userAgent,
            expiresAt,
        });
        const userPayload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            company: user.company,
            permissions: user.permissionsOverride,
        };
        return { user: userPayload, accessToken, refreshToken };
    }
}
exports.AuthService = AuthService;

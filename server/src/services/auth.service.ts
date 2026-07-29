import crypto from "crypto";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model.js";
import { RefreshToken } from "../models/refresh-token.model.js";
import { AuditLog } from "../models/audit-log.model.js";
import { ApiError } from "../utils/api-error.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt.helper.js";
import { sendEmail, sendWelcomeEmail, sendClientWelcomeEmail } from "./email.service.js";

export class AuthService {
  static async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    company?: string;
    phone?: string;
  }, ipAddress: string = "127.0.0.1", userAgent: string = "Unknown") {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(400, "An account with this email address already exists");
    }

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: (userData.role as any) || "USER",
      company: userData.company || "",
      phone: userData.phone || "",
      status: "active",
    });

    await AuditLog.create({
      userId: user._id,
      action: "USER_REGISTERED",
      ipAddress,
      userAgent,
      details: { email: user.email, role: user.role },
    });

    const accessToken = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    return { user, accessToken, refreshToken };
  }

  static async login(credentials: { email: string; password: string }, ipAddress: string = "127.0.0.1", userAgent: string = "Unknown") {
    const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (user.status !== "active") {
      throw new ApiError(403, "Account is deactivated or suspended. Please contact support.");
    }

    if (user.isLocked()) {
      throw new ApiError(423, "Account temporarily locked due to consecutive failed login attempts. Try again in 15 minutes.");
    }

    const isMatch = await user.comparePassword(credentials.password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }
      await user.save();

      await AuditLog.create({
        userId: user._id,
        action: "LOGIN_FAILED",
        ipAddress,
        userAgent,
        details: { attempts: user.failedLoginAttempts },
      });

      throw new ApiError(401, "Invalid email or password");
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const accessToken = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    await AuditLog.create({
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

  static async refreshTokens(incomingRefreshToken: string, ipAddress: string = "127.0.0.1", userAgent: string = "Unknown") {
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    const tokenDoc = await RefreshToken.findOne({ token: incomingRefreshToken, isRevoked: false });
    if (!tokenDoc) {
      throw new ApiError(401, "Invalid or revoked refresh token");
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user || user.status !== "active") {
      throw new ApiError(401, "User no longer active");
    }

    // Revoke old refresh token (Token Rotation)
    tokenDoc.isRevoked = true;
    await tokenDoc.save();

    // Generate new token pair
    const newAccessToken = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user._id });

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      userId: user._id,
      token: newRefreshToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(refreshToken: string, userId?: string) {
    if (refreshToken) {
      await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
    }
    if (userId) {
      await AuditLog.create({
        userId: userId as any,
        action: "LOGOUT",
        ipAddress: "127.0.0.1",
        userAgent: "Unknown",
      });
    }
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return gracefully to prevent email enumeration
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
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

  static async resetPassword(resetToken: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      throw new ApiError(400, "Password reset token is invalid or has expired");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Revoke all active refresh sessions for security
    await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });

    await AuditLog.create({
      userId: user._id,
      action: "PASSWORD_RESET_SUCCESS",
      ipAddress: "127.0.0.1",
      userAgent: "Unknown",
    });
  }
  static async createAccountWithActivation(
    userData: { name: string; email: string; role: string; type: "EMPLOYEE" | "CLIENT"; companyName?: string; accountManager?: string },
    ipAddress: string = "127.0.0.1",
    userAgent: string = "Unknown"
  ) {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(400, "An account with this email address already exists");
    }

    const activationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(activationToken).digest("hex");

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: crypto.randomBytes(32).toString("hex"), // temporary random password, never used
      role: userData.role,
      status: "active",
      activationToken: hashedToken,
      activationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    await AuditLog.create({
      userId: user._id,
      action: "ACCOUNT_PROVISIONED",
      ipAddress,
      userAgent,
      details: { email: user.email, role: user.role },
    });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const activationUrl = `${clientUrl}/activate?token=${activationToken}`;

    if (userData.type === "CLIENT") {
      await sendClientWelcomeEmail(user.email, user.name, userData.accountManager || "Our Team", activationUrl);
    } else {
      await sendWelcomeEmail(user.email, user.name, activationUrl);
    }

    return user;
  }

  static async activateAccount(activationToken: string, newPassword: string, ipAddress: string = "127.0.0.1", userAgent: string = "Unknown") {
    const hashedToken = crypto.createHash("sha256").update(activationToken).digest("hex");

    const user = await User.findOne({
      activationToken: hashedToken,
      activationExpires: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      throw new ApiError(400, "Activation token is invalid or has expired");
    }

    user.password = newPassword;
    user.activationToken = undefined;
    user.activationExpires = undefined;
    user.isEmailVerified = true;
    await user.save();

    await AuditLog.create({
      userId: user._id,
      action: "ACCOUNT_ACTIVATED",
      ipAddress,
      userAgent,
    });

    // Generate tokens for automatic login
    const accessToken = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user._id });

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
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

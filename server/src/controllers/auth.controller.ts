import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../helpers/cookie.helper.js";
import { AuthenticatedRequest } from "../types/index.js";
import { User } from "../models/user.model.js";
import { RefreshToken } from "../models/refresh-token.model.js";
import { cloudinary } from "../config/cloudinary.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const ipAddress = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.get("user-agent") || "Unknown";

  const { user, accessToken, refreshToken } = await AuthService.register(req.body, ipAddress, userAgent);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(201).json(
    new ApiResponse(201, { user, accessToken }, "Registration successful")
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const ipAddress = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.get("user-agent") || "Unknown";

  const { user, accessToken, refreshToken } = await AuthService.login(req.body, ipAddress, userAgent);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json(
    new ApiResponse(200, { user, accessToken }, "Login successful")
  );
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  await AuthService.logout(refreshToken, req.user?.userId);
  clearRefreshTokenCookie(res);

  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const ipAddress = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.get("user-agent") || "Unknown";

  const { accessToken, refreshToken } = await AuthService.refreshTokens(incomingRefreshToken, ipAddress, userAgent);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json(
    new ApiResponse(200, { accessToken }, "Token refreshed successfully")
  );
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body.email);
  return res.status(200).json(
    new ApiResponse(200, null, "If an account exists with that email, a password reset link has been sent.")
  );
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body.token, req.body.newPassword);
  return res.status(200).json(
    new ApiResponse(200, null, "Password reset successfully. You can now log in with your new password.")
  );
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user?.userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new ApiError(404, "User profile not found");
  }
  return res.status(200).json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(req.user?.userId, req.body, { new: true, runValidators: true });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

export const updateAvatar = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const uploadRes = await cloudinary.uploader.upload(dataURI, {
    folder: "nuvexora/avatars",
  });

  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    { avatar: uploadRes.secure_url },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, { avatar: user?.avatar }, "Avatar updated successfully"));
});

export const softDeleteAccount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(req.user?.userId, { status: "soft_deleted" }, { new: true });
  if (user) {
    await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });
  }
  clearRefreshTokenCookie(res);
  return res.status(200).json(new ApiResponse(200, null, "Account deactivated and deleted successfully"));
});

export const getSessions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const sessions = await RefreshToken.find({ userId: req.user?.userId, isRevoked: false }).select("ipAddress userAgent createdAt expiresAt");
  return res.status(200).json(new ApiResponse(200, sessions, "Active sessions retrieved successfully"));
});

export const revokeOtherSessions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const currentToken = req.cookies?.refreshToken;
  await RefreshToken.updateMany(
    { userId: req.user?.userId, token: { $ne: currentToken } },
    { isRevoked: true }
  );
  return res.status(200).json(new ApiResponse(200, null, "Other sessions revoked successfully"));
});

export const activateAccount = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) {
    throw new ApiError(400, "Activation token and new password are required");
  }

  const ipAddress = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.get("user-agent") || "Unknown";

  const { user, accessToken, refreshToken } = await AuthService.activateAccount(token, password, ipAddress, userAgent);
  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json(new ApiResponse(200, { user, accessToken }, "Account activated successfully"));
});

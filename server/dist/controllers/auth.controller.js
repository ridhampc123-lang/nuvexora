"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateAccount = exports.revokeOtherSessions = exports.getSessions = exports.softDeleteAccount = exports.updateAvatar = exports.updateProfile = exports.getMe = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const auth_service_js_1 = require("../services/auth.service.js");
const async_handler_js_1 = require("../utils/async-handler.js");
const api_response_js_1 = require("../utils/api-response.js");
const api_error_js_1 = require("../utils/api-error.js");
const cookie_helper_js_1 = require("../helpers/cookie.helper.js");
const user_model_js_1 = require("../models/user.model.js");
const refresh_token_model_js_1 = require("../models/refresh-token.model.js");
const cloudinary_js_1 = require("../config/cloudinary.js");
exports.register = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const ipAddress = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.get("user-agent") || "Unknown";
    const { user, accessToken, refreshToken } = await auth_service_js_1.AuthService.register(req.body, ipAddress, userAgent);
    (0, cookie_helper_js_1.setRefreshTokenCookie)(res, refreshToken);
    return res.status(201).json(new api_response_js_1.ApiResponse(201, { user, accessToken }, "Registration successful"));
});
exports.login = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const ipAddress = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.get("user-agent") || "Unknown";
    const { user, accessToken, refreshToken } = await auth_service_js_1.AuthService.login(req.body, ipAddress, userAgent);
    (0, cookie_helper_js_1.setRefreshTokenCookie)(res, refreshToken);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, { user, accessToken }, "Login successful"));
});
exports.logout = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    await auth_service_js_1.AuthService.logout(refreshToken, req.user?.userId);
    (0, cookie_helper_js_1.clearRefreshTokenCookie)(res);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Logout successful"));
});
exports.refresh = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const ipAddress = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.get("user-agent") || "Unknown";
    const { accessToken, refreshToken } = await auth_service_js_1.AuthService.refreshTokens(incomingRefreshToken, ipAddress, userAgent);
    (0, cookie_helper_js_1.setRefreshTokenCookie)(res, refreshToken);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, { accessToken }, "Token refreshed successfully"));
});
exports.forgotPassword = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    await auth_service_js_1.AuthService.forgotPassword(req.body.email);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "If an account exists with that email, a password reset link has been sent."));
});
exports.resetPassword = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    await auth_service_js_1.AuthService.resetPassword(req.body.token, req.body.newPassword);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Password reset successfully. You can now log in with your new password."));
});
exports.changePassword = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await user_model_js_1.User.findById(req.user?.userId).select("+password");
    if (!user) {
        throw new api_error_js_1.ApiError(404, "User not found");
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new api_error_js_1.ApiError(400, "Current password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Password changed successfully"));
});
exports.getMe = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const user = await user_model_js_1.User.findById(req.user?.userId);
    if (!user) {
        throw new api_error_js_1.ApiError(404, "User profile not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, user, "User profile retrieved successfully"));
});
exports.updateProfile = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const user = await user_model_js_1.User.findByIdAndUpdate(req.user?.userId, req.body, { new: true, runValidators: true });
    if (!user) {
        throw new api_error_js_1.ApiError(404, "User not found");
    }
    return res.status(200).json(new api_response_js_1.ApiResponse(200, user, "Profile updated successfully"));
});
exports.updateAvatar = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        throw new api_error_js_1.ApiError(400, "Image file is required");
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const uploadRes = await cloudinary_js_1.cloudinary.uploader.upload(dataURI, {
        folder: "nuvexora/avatars",
    });
    const user = await user_model_js_1.User.findByIdAndUpdate(req.user?.userId, { avatar: uploadRes.secure_url }, { new: true });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, { avatar: user?.avatar }, "Avatar updated successfully"));
});
exports.softDeleteAccount = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const user = await user_model_js_1.User.findByIdAndUpdate(req.user?.userId, { status: "soft_deleted" }, { new: true });
    if (user) {
        await refresh_token_model_js_1.RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });
    }
    (0, cookie_helper_js_1.clearRefreshTokenCookie)(res);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Account deactivated and deleted successfully"));
});
exports.getSessions = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const sessions = await refresh_token_model_js_1.RefreshToken.find({ userId: req.user?.userId, isRevoked: false }).select("ipAddress userAgent createdAt expiresAt");
    return res.status(200).json(new api_response_js_1.ApiResponse(200, sessions, "Active sessions retrieved successfully"));
});
exports.revokeOtherSessions = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const currentToken = req.cookies?.refreshToken;
    await refresh_token_model_js_1.RefreshToken.updateMany({ userId: req.user?.userId, token: { $ne: currentToken } }, { isRevoked: true });
    return res.status(200).json(new api_response_js_1.ApiResponse(200, null, "Other sessions revoked successfully"));
});
exports.activateAccount = (0, async_handler_js_1.asyncHandler)(async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        throw new api_error_js_1.ApiError(400, "Activation token and new password are required");
    }
    const ipAddress = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.get("user-agent") || "Unknown";
    const { user, accessToken, refreshToken } = await auth_service_js_1.AuthService.activateAccount(token, password, ipAddress, userAgent);
    (0, cookie_helper_js_1.setRefreshTokenCookie)(res, refreshToken);
    return res.status(200).json(new api_response_js_1.ApiResponse(200, { user, accessToken }, "Account activated successfully"));
});

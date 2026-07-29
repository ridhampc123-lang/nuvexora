"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireAdmin = exports.requireSuperAdmin = exports.requirePermission = exports.authorizeRoles = exports.authenticateJWT = exports.authorize = exports.requireRole = exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_error_js_1 = require("../utils/api-error.js");
const user_model_js_1 = require("../models/user.model.js");
const verifyJWT = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        if (!token) {
            throw new api_error_js_1.ApiError(401, "Authentication token missing.");
        }
        const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = await user_model_js_1.User.findById(decoded.userId).select("status permissionsOverride role");
        if (!user || user.status !== "active") {
            throw new api_error_js_1.ApiError(401, "User account is suspended, deactivated, or no longer exists.");
        }
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: user.role,
            permissions: user.permissionsOverride || [],
        };
        next();
    }
    catch (error) {
        next(new api_error_js_1.ApiError(401, error.message || "Invalid or expired authentication token"));
    }
};
exports.verifyJWT = verifyJWT;
const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new api_error_js_1.ApiError(401, "User is not authenticated"));
        }
        if (req.user.role === "SUPER_ADMIN") {
            return next();
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new api_error_js_1.ApiError(403, `Access denied. Requires role: ${allowedRoles.join(" or ")}`));
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.authorize = exports.requireRole;
exports.authenticateJWT = exports.verifyJWT;
exports.authorizeRoles = exports.requireRole;
const requirePermission = (...requiredPermissions) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new api_error_js_1.ApiError(401, "User is not authenticated"));
        }
        if (req.user.role === "SUPER_ADMIN" || req.user.role === "ADMIN") {
            return next();
        }
        const userPermissions = req.user.permissions || [];
        const hasPermission = requiredPermissions.every((p) => userPermissions.includes(p));
        if (!hasPermission) {
            return next(new api_error_js_1.ApiError(403, `Access denied. Required permission: ${requiredPermissions.join(", ")}`));
        }
        next();
    };
};
exports.requirePermission = requirePermission;
exports.requireSuperAdmin = (0, exports.requireRole)("SUPER_ADMIN");
exports.requireAdmin = (0, exports.requireRole)("SUPER_ADMIN", "ADMIN");
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        if (token) {
            const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.user = decoded;
        }
    }
    catch {
        // Ignore invalid token for optional auth
    }
    next();
};
exports.optionalAuth = optionalAuth;

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, IUserPayload } from "../types/index.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      throw new ApiError(401, "Authentication token missing.");
    }

    const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
    const decoded = jwt.verify(token, secret) as IUserPayload;

    const user = await User.findById(decoded.userId).select("status permissionsOverride role");
    if (!user || user.status !== "active") {
      throw new ApiError(401, "User account is suspended, deactivated, or no longer exists.");
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: user.role,
      permissions: user.permissionsOverride || [],
    };

    next();
  } catch (error: any) {
    next(new ApiError(401, error.message || "Invalid or expired authentication token"));
  }
};

export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "User is not authenticated"));
    }

    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Requires role: ${allowedRoles.join(" or ")}`));
    }

    next();
  };
};

export const authorize = requireRole;
export const authenticateJWT = verifyJWT;
export const authorizeRoles = requireRole;

export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "User is not authenticated"));
    }

    if (req.user.role === "SUPER_ADMIN" || req.user.role === "ADMIN") {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.every((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return next(new ApiError(403, `Access denied. Required permission: ${requiredPermissions.join(", ")}`));
    }

    next();
  };
};

export const requireSuperAdmin = requireRole("SUPER_ADMIN");
export const requireAdmin = requireRole("SUPER_ADMIN", "ADMIN");

export const optionalAuth = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (token) {
      const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
      const decoded = jwt.verify(token, secret) as IUserPayload;
      req.user = decoded;
    }
  } catch {
    // Ignore invalid token for optional auth
  }
  next();
};

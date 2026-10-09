import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, IUserPayload } from "../types/index.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";

export const verifyJWT = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      throw new ApiError(401, "Authentication token missing.");
    }

    const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
    const decoded = jwt.verify(token, secret) as IUserPayload;

    const user = await User.findById(decoded.userId).select("status permissionsOverride role email name");
    if (!user || user.status !== "active") {
      throw new ApiError(401, "User account is suspended, deactivated, or no longer exists.");
    }

    // Resolve dynamic permissions assigned to the user's role in the database
    const effectivePermissions: string[] = Array.isArray(user.permissionsOverride)
      ? [...user.permissionsOverride]
      : [];

    try {
      const roleDoc = await Role.findOne({ code: user.role }).populate("permissions");
      if (roleDoc && Array.isArray(roleDoc.permissions)) {
        for (const p of roleDoc.permissions as any[]) {
          const pCode = typeof p === "string" ? p : p?.code;
          if (pCode && !effectivePermissions.includes(pCode)) {
            effectivePermissions.push(pCode);
          }
        }
      }
    } catch (roleErr) {
      console.warn("Could not populate role permissions:", roleErr);
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: user.role,
      permissions: effectivePermissions,
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

    // Super Admin has unrestricted wildcard access to all system directives
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return next(
        new ApiError(
          403,
          `Access denied. You do not possess the required backend permission: [${requiredPermissions.join(", ")}].`
        )
      );
    }

    next();
  };
};

export const requireRoleOrPermission = (allowedRoles: string[], requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "User is not authenticated"));
    }

    if (req.user.role === "SUPER_ADMIN" || allowedRoles.includes(req.user.role)) {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return next(
        new ApiError(
          403,
          `Access denied. Requires one of roles: [${allowedRoles.join(", ")}] or permissions: [${requiredPermissions.join(", ")}].`
        )
      );
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

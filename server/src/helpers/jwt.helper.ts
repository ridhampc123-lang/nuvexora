import jwt, { SignOptions } from "jsonwebtoken";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("[SECURITY CRITICAL] JWT_SECRET must be configured in production environment variables.");
    }
    return "nuvexora_dev_jwt_secret_key_minimum_32_characters_secure";
  }
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("[SECURITY CRITICAL] JWT_REFRESH_SECRET must be configured in production environment variables.");
    }
    return "nuvexora_dev_refresh_secret_minimum_32_characters_secure";
  }
  return secret;
};

export const generateAccessToken = (payload: object): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "15m") as SignOptions["expiresIn"];
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
};

export const generateRefreshToken = (payload: object): string => {
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  return jwt.sign(payload, getRefreshSecret(), { expiresIn });
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, getJwtSecret());
};

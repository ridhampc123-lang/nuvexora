import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const generateRefreshToken = (payload: object): string => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "nuvexora_refresh_secret_key_2026_ultra_secure";
  return jwt.sign(payload, refreshSecret, { expiresIn: "30d" });
};

export const verifyAccessToken = (token: string): any => {
  const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
  return jwt.verify(token, secret);
};

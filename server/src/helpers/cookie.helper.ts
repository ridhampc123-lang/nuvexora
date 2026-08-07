import { Response } from "express";

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/v1/auth/refresh",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/v1/auth/refresh",
  });
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (payload) => {
    const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "7d" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "nuvexora_refresh_secret_key_2026_ultra_secure";
    return jsonwebtoken_1.default.sign(payload, refreshSecret, { expiresIn: "30d" });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    const secret = process.env.JWT_SECRET || "nuvexora_super_secret_jwt_key_2026_enterprise_level_secure";
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyAccessToken = verifyAccessToken;

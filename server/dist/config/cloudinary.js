"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_1 = __importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    // Disallow dangerous executables, allow all media, docs, spreadsheets, archives, text
    const disallowedExtensions = [".exe", ".bat", ".cmd", ".sh", ".ps1", ".vbs", ".dll", ".so", ".bin"];
    const ext = (file.originalname || "").toLowerCase().substring((file.originalname || "").lastIndexOf("."));
    if (disallowedExtensions.includes(ext)) {
        return cb(new Error("Executable binary files are restricted for enterprise security."));
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter,
});

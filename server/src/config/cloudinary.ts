import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Disallow dangerous executables, allow all media, docs, spreadsheets, archives, text
  const disallowedExtensions = [".exe", ".bat", ".cmd", ".sh", ".ps1", ".vbs", ".dll", ".so", ".bin"];
  const ext = (file.originalname || "").toLowerCase().substring((file.originalname || "").lastIndexOf("."));
  if (disallowedExtensions.includes(ext)) {
    return cb(new Error("Executable binary files are restricted for enterprise security."));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter,
});

export { cloudinary };

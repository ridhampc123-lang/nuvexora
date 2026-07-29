import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateProfile,
  updateAvatar,
  softDeleteAccount,
  getSessions,
  revokeOtherSessions,
  activateAccount,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "../validations/auth.validation.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

// Public Auth Endpoints
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/activate", activateAccount);

// Protected Auth Endpoints (Requires Access Token)
router.use(verifyJWT);

router.get("/me", getMe);
router.post("/change-password", validate(changePasswordSchema), changePassword);
router.put("/profile", validate(updateProfileSchema), updateProfile);
router.post("/avatar", upload.single("avatar"), updateAvatar);
router.delete("/account", softDeleteAccount);
router.get("/sessions", getSessions);
router.post("/sessions/revoke-others", revokeOtherSessions);

export default router;

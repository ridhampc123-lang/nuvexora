"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const validate_middleware_js_1 = require("../middleware/validate.middleware.js");
const auth_validation_js_1 = require("../validations/auth.validation.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const cloudinary_js_1 = require("../config/cloudinary.js");
const router = (0, express_1.Router)();
// Public Auth Endpoints
router.post("/register", (0, validate_middleware_js_1.validate)(auth_validation_js_1.registerSchema), auth_controller_js_1.register);
router.post("/login", (0, validate_middleware_js_1.validate)(auth_validation_js_1.loginSchema), auth_controller_js_1.login);
router.post("/logout", auth_controller_js_1.logout);
router.post("/refresh", auth_controller_js_1.refresh);
router.post("/forgot-password", (0, validate_middleware_js_1.validate)(auth_validation_js_1.forgotPasswordSchema), auth_controller_js_1.forgotPassword);
router.post("/reset-password", (0, validate_middleware_js_1.validate)(auth_validation_js_1.resetPasswordSchema), auth_controller_js_1.resetPassword);
router.post("/activate", auth_controller_js_1.activateAccount);
// Protected Auth Endpoints (Requires Access Token)
router.use(auth_middleware_js_1.verifyJWT);
router.get("/me", auth_controller_js_1.getMe);
router.post("/change-password", (0, validate_middleware_js_1.validate)(auth_validation_js_1.changePasswordSchema), auth_controller_js_1.changePassword);
router.put("/profile", (0, validate_middleware_js_1.validate)(auth_validation_js_1.updateProfileSchema), auth_controller_js_1.updateProfile);
router.post("/avatar", cloudinary_js_1.upload.single("avatar"), auth_controller_js_1.updateAvatar);
router.delete("/account", auth_controller_js_1.softDeleteAccount);
router.get("/sessions", auth_controller_js_1.getSessions);
router.post("/sessions/revoke-others", auth_controller_js_1.revokeOtherSessions);
exports.default = router;

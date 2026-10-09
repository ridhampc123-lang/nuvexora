import { Router } from "express";
import { createProject, getClientProjects, updateProjectProgress } from "../controllers/project.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProjectSchema } from "../validations/project.validation.js";
import { verifyJWT, requireRoleOrPermission } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getClientProjects);
router.post(
  "/",
  requireRoleOrPermission(["ADMIN", "SUPER_ADMIN", "PROJECT_MANAGER"], ["PROJECTS_MANAGE"]),
  validate(createProjectSchema),
  createProject
);
router.patch(
  "/:id/progress",
  requireRoleOrPermission(["ADMIN", "SUPER_ADMIN", "PROJECT_MANAGER"], ["PROJECTS_MANAGE"]),
  updateProjectProgress
);

export default router;

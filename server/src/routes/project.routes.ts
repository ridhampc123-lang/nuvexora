import { Router } from "express";
import { createProject, getClientProjects, updateProjectProgress } from "../controllers/project.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProjectSchema } from "../validations/project.validation.js";
import { verifyJWT, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getClientProjects);
router.post("/", authorize("admin"), validate(createProjectSchema), createProject);
router.patch("/:id/progress", authorize("admin"), updateProjectProgress);

export default router;

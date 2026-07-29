import { Router } from "express";
import { getBlogs, getBlogBySlug, createBlog } from "../controllers/blog.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createBlogSchema } from "../validations/blog.validation.js";
import { verifyJWT, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", verifyJWT, authorize("admin"), validate(createBlogSchema), createBlog);

export default router;

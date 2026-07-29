import { Router } from "express";
import { getHomepageData, bookMeeting, subscribeNewsletter, getPublicPortfolio } from "../controllers/public.controller.js";

const router = Router();

router.get("/homepage", getHomepageData);
router.get("/portfolio", getPublicPortfolio);
router.post("/meetings/book", bookMeeting);
router.post("/newsletter/subscribe", subscribeNewsletter);

export default router;

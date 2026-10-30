import { Router } from "express";
import { getHomepageData, bookMeeting, subscribeNewsletter, getPublicPortfolio } from "../controllers/public.controller.js";
import { getPublicPricing, getPublicCurrencies } from "../controllers/pricing.controller.js";
import { getPublicCaseStudies, getPublicCaseStudyBySlug } from "../controllers/case-study.controller.js";

const router = Router();

router.get("/homepage", getHomepageData);
router.get("/portfolio", getPublicPortfolio);
router.get("/case-studies", getPublicCaseStudies);
router.get("/case-studies/:slug", getPublicCaseStudyBySlug);
router.get("/pricing", getPublicPricing);
router.get("/currencies", getPublicCurrencies);
router.post("/meetings/book", bookMeeting);
router.post("/newsletter/subscribe", subscribeNewsletter);

export default router;

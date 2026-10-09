import { Router } from "express";
import { getHomepageData, bookMeeting, subscribeNewsletter, getPublicPortfolio } from "../controllers/public.controller.js";
import { getPublicPricing, getPublicCurrencies } from "../controllers/pricing.controller.js";

const router = Router();

router.get("/homepage", getHomepageData);
router.get("/portfolio", getPublicPortfolio);
router.get("/pricing", getPublicPricing);
router.get("/currencies", getPublicCurrencies);
router.post("/meetings/book", bookMeeting);
router.post("/newsletter/subscribe", subscribeNewsletter);

export default router;

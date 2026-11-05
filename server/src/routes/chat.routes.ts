import { Router } from "express";
import { getChannelMessages, sendChatMessage, getChatChannels, getAssignedTeamMembers, purgeDummyMessages } from "../controllers/chat.controller.js";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all chat routes with JWT verification
router.use(verifyJWT);

router.get("/messages", getChannelMessages);
router.post("/messages", sendChatMessage);
router.get("/channels", getChatChannels);
router.get("/team-members", getAssignedTeamMembers);
router.post("/purge-dummy-data", requireRole("SUPER_ADMIN"), purgeDummyMessages);

export default router;



import { Router } from "express";
import { getChannelMessages, sendChatMessage, getChatChannels, getAssignedTeamMembers, purgeDummyMessages } from "../controllers/chat.controller.js";

const router = Router();

router.get("/messages", getChannelMessages);
router.post("/messages", sendChatMessage);
router.get("/channels", getChatChannels);
router.get("/team-members", getAssignedTeamMembers);
router.post("/purge-dummy-data", purgeDummyMessages);

export default router;



import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message.controllers.js";

const router = Router();

router.post("/message", sendMessage);
router.get("/messages", getMessages);

export default router;
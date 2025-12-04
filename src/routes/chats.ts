import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { createChat, getChatsForUser } from "../controllers/chats";

const router = Router();

router.get("/", authMiddleware, getChatsForUser);
router.post("/", authMiddleware, createChat);

export default router;

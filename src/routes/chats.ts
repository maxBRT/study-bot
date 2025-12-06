import { Router } from "express";
import type { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth";
import { createChat, getChatsForUser, getChat, deleteChat } from "../controllers/chats";

const router = Router();

// Necessary cast: the middleware guarantees that the request contains `user` and `session`,
// but TypeScript cannot infer this transformation from Request → AuthenticatedRequest.
router.get("/", authMiddleware, getChatsForUser as RequestHandler);
router.get("/:id", authMiddleware, getChat as RequestHandler);
router.post("/", authMiddleware, createChat as RequestHandler);
router.delete("/:id", authMiddleware, deleteChat as RequestHandler);

export default router;

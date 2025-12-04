import { Router } from "express";
import type { RequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth";
import { createChat, getChatsForUser, getChat, deleteChat } from "../controllers/chats";

const router = Router();

// Cast nécessaire : le middleware garantit que la requête contient `user` et `session`,
// mais TypeScript ne peut pas inférer cette transformation de Request → AuthenticatedRequest.
router.get("/", authMiddleware, getChatsForUser as RequestHandler);
router.get("/:id", authMiddleware, getChat as RequestHandler);
router.post("/", authMiddleware, createChat as RequestHandler);
router.delete("/:id", authMiddleware, deleteChat as RequestHandler);

export default router;

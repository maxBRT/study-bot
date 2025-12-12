import { Router } from "express";
import type { RequestHandler } from "express";
import { createChat, getChatsForUser, getChat, deleteChat, updateChat } from "../controllers/chats";

const router = Router();

// Necessary cast: the middleware guarantees that the request contains `user` and `session`,
// but TypeScript cannot infer this transformation from Request → AuthenticatedRequest.
router.get("/", getChatsForUser as RequestHandler);
router.get("/:id", getChat as RequestHandler);
router.post("/", createChat as RequestHandler);
router.put("/:id", updateChat as RequestHandler);
router.delete("/:id", deleteChat as RequestHandler);

export default router;

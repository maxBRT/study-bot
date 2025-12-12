import { Router, type RequestHandler } from "express";
import { getMe, getStats } from "../controllers/me";

const router = Router();

router.get("/", getMe as RequestHandler);
router.get("/stats", getStats as RequestHandler);

export default router;

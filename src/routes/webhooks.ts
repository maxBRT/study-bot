import { Router } from "express";
import { processTokenPurchase } from "../controllers/webhooks";

const router = Router();

router.post("/stripe", processTokenPurchase);

export default router;
import { Router, type RequestHandler } from 'express';
import { sendMessage } from '../controllers/messages';
import { authMiddleware } from '../middlewares/auth';
import { tokenUsageMiddleware } from '../middlewares/token';

const router = Router();

router.post('/', authMiddleware, tokenUsageMiddleware as RequestMiddleware, sendMessage as RequestHandler);

export default router;
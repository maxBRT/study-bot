import { Router, type RequestHandler } from 'express';
import { sendMessage } from '../controllers/messages';
import { tokenUsageMiddleware } from '../middlewares/token';

const router = Router();

router.post('/', tokenUsageMiddleware as RequestHandler, sendMessage as RequestHandler);

export default router;
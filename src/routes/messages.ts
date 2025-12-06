import { Router, type RequestHandler } from 'express';
import { sendMessage } from '../controllers/messages';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/', authMiddleware, sendMessage as RequestHandler);

export default router;
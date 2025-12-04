import { Router, type RequestHandler } from 'express';
import { postMessage } from '../controllers/messages';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/', authMiddleware, postMessage as RequestHandler);

export default router;
import { Router, type RequestHandler } from 'express';
import { getTokenUsage, listTokenUsages } from '../controllers/tokenUsages';

const router = Router();

router.get('/', listTokenUsages as RequestHandler);
router.get('/:id', getTokenUsage as RequestHandler);

export default router;

import { Router } from 'express';
import { generateText } from '../controllers/ai';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/generate', requireAuth as any, generateText as any);

export default router;

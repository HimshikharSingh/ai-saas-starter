import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.get('/me', requireAuth as any, getMe as any);

export default router;

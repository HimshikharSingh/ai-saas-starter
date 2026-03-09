import { Router } from 'express';
import { createCheckoutSession, createPortalSession, handleWebhook } from '../controllers/billing';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/create-checkout-session', requireAuth as any, createCheckoutSession as any);
router.post('/create-portal-session', requireAuth as any, createPortalSession as any);
// Webhook must NOT use requireAuth, as it comes from Stripe directly
router.post('/webhook', handleWebhook as any);

export default router;

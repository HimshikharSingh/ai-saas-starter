"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const billing_1 = require("../controllers/billing");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/create-checkout-session', auth_1.requireAuth, billing_1.createCheckoutSession);
router.post('/create-portal-session', auth_1.requireAuth, billing_1.createPortalSession);
// Webhook must NOT use requireAuth, as it comes from Stripe directly
router.post('/webhook', billing_1.handleWebhook);
exports.default = router;
//# sourceMappingURL=billing.js.map
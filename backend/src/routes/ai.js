"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_1 = require("../controllers/ai");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/generate', auth_1.requireAuth, ai_1.generateText);
exports.default = router;
//# sourceMappingURL=ai.js.map
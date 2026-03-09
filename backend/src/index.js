"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./middlewares/error");
const auth_1 = __importDefault(require("./routes/auth"));
const billing_1 = __importDefault(require("./routes/billing"));
const ai_1 = __importDefault(require("./routes/ai"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
// Webhooks require raw body for signature verification
app.use('/api/v1/billing/webhook', express_1.default.raw({ type: 'application/json' }));
app.use(express_1.default.json());
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/billing', billing_1.default);
app.use('/api/v1/ai', ai_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Centralized Error Handling
app.use(error_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
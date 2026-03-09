import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error';
import authRoutes from './routes/auth';
import billingRoutes from './routes/billing';
import aiRoutes from './routes/ai';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Webhooks require raw body for signature verification
app.use('/api/v1/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/ai', aiRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Centralized Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

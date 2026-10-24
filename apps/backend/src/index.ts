// File: src/index.ts
// Module responsible for backend functionality.

import '../instrument.js';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { expressErrorHandler, setupExpressErrorHandler } from '@sentry/node';

import { CONFIG } from '@/config/env.config.js';
// Logger and middlewares
import logger from '@/logger/index.js';
import { errorHandler } from '@/middlewares/error-handler.middleware.js';
import { apiRateLimit } from '@/middlewares/rate-limit.middleware.js';
import { initSocketServer } from '@/utils/socket.js';

// Routes
import authRoutes from '@/routes/auth.routes.js';
import productRoutes from '@/routes/products.routes.js';
import sellerRoutes from '@/routes/sellerApplications.routes.js';
import transactionRoutes from '@/routes/transactions.routes.js';
import userRoutes from '@/routes/users.routes.js';
import adminRoutes from '@/routes/admin.routes.js';
import currencyRoutes from '@/routes/currency.routes.js';
import notificationRoutes from '@/routes/notifications.routes.js';
import favoritesRoutes from '@/routes/favorites.routes.js';

// Services
import { auth } from '@/auth.js';
import { CurrencyService } from '@/services/currency.service.js';
import { initCronJobs } from '@/services/cron.service.js';

const app = express();
const httpServer = createServer(app);

// Express configuration
app.set('trust proxy', 1);

// 1. Initial security
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allows image loading across origins
}));

const allowedOrigins = [
    CONFIG.FRONTEND_URL,
    CONFIG.BACKEND_URL,
    ...CONFIG.CORS_ALLOWED_ORIGINS,
].filter((origin): origin is string => Boolean(origin));


app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.error(`CORS Bloqueado para el origen: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-better-auth-id', 'x-better-auth-session-token']
}));

initSocketServer(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});
// 2. Parsers and optimization
app.use(express.json({ limit: '10kb' })); // Slightly higher limit for batch payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(hpp());
app.use(compression());

// 3. Logging
if (CONFIG.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
}

// 4. AUTH & RATE LIMIT
const { toNodeHandler } = await import('better-auth/node');

app.use(apiRateLimit); // General protection against spam

// Health endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        env: CONFIG.NODE_ENV,
    });
});

// Test error endpoint for Sentry
app.get('/test-error', (_req, _res) => {
    throw new Error('Test error for Sentry');
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 5. Routes
app.get('/api/auth', (_req, res) => {
    res.status(200).json({
        ok: true,
        service: 'better-auth',
        message: 'Auth service is available.',
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/auth', toNodeHandler(auth));
app.use('/api/currency', currencyRoutes);
app.use('/api/seller-applications', sellerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/notifications', notificationRoutes);

// 6. Error handling (final middleware)
if (CONFIG.IS_PRODUCTION) {
    // Use the setup helper to attach Sentry's error handler to the app
    setupExpressErrorHandler(app);
} else {
    app.use(expressErrorHandler);
}

app.use(errorHandler);

// Background services (only in local dev, not in Vercel)
if (CONFIG.NODE_ENV !== 'production') {
    CurrencyService.syncRateToDB().catch(err => logger.error('Initial BCV sync error', err));
    initCronJobs();
}

if (process.env.NODE_ENV !== 'test') {
    httpServer.listen(CONFIG.PORT, () => {
        logger.info(`Server started on port ${CONFIG.PORT} (${CONFIG.NODE_ENV})`);
    });
}

export default app;
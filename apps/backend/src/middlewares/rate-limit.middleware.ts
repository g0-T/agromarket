// File: src/middlewares/rate-limit.middleware.ts
// Module responsible for backend functionality.

import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Allow disabling rate limits during load testing or in specific envs
const isRateLimitDisabled = (process.env.DISABLE_RATE_LIMIT === 'true')
    || (process.env.LOAD_TESTING === 'true')
    || (process.env.NODE_ENV === 'test');

function noop(_req: Request, _res: Response, next: NextFunction) {
    return next();
}

// Helper to create either a real limiter or a noop middleware
function makeLimiter(opts: Parameters<typeof rateLimit>[0]) {
    if (isRateLimitDisabled) {
        return noop;
    }
    return rateLimit(opts);
}

// Exported function loginRateLimit.
export const loginRateLimit = makeLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            message: 'Demasiados intentos de inicio de sesión. Por favor, intente de nuevo en 15 minutos.'
        });
    },
    skipSuccessfulRequests: false,
});

// Exported function otpRateLimit.
export const otpRateLimit = makeLimiter({
    windowMs: 10 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            message: 'Demasiadas solicitudes de OTP. Intente de nuevo en 10 minutos.'
        });
    },
});

// Exported function apiRateLimit.
export const apiRateLimit = makeLimiter({
    windowMs: 1 * 60 * 1000,
    max: 60,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            success: false,
            message: 'Demasiadas peticiones. Relájate un poco.'
        });
    },
});
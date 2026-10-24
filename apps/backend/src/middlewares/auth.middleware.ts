// File: src/middlewares/auth.middleware.ts
// Module responsible for backend functionality.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { auth } from '@/auth.js';
import logger from '@/logger/index.js';
import { CONFIG } from '@/config/env.config.js';
import { MemoryCache } from '@/utils/memory-cache.js';

const SESSION_CACHE_TTL_MS = 1000 * 60 * 2;
const sessionCache = new MemoryCache();

// Exported symbol AuthRequest.
export interface AuthRequest extends Request {
    user?: any;
}

function buildUserFromJwt(payload: Record<string, any>) {
    const userId = payload.sub || payload.userId || payload.id || payload?.user?.id;
    if (!userId) return null;

    return {
        id: String(userId),
        role: payload.role || payload?.user?.role,
        email: payload.email || payload?.user?.email,
    };
}

// Exported function isAuth.
export const isAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeaders = {
            authorization: req.headers.authorization,
            cookie: req.headers.cookie,
            'x-better-auth-id': (req.headers as any)['x-better-auth-id'],
        };

        logger.info('[AUTH MIDDLEWARE] Validating session with headers', {
            hasAuth: !!req.headers.authorization,
            hasCookie: !!req.headers.cookie,
            hasBetterAuthId: !!(req.headers as any)['x-better-auth-id'],
            contentType: req.headers['content-type']
        });

        const authHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization.trim() : '';
        const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

        if (bearerToken) {
            const cachedUser = sessionCache.get<any>(bearerToken);
            if (cachedUser) {
                req.user = cachedUser;
                return next();
            }

            if (CONFIG.AUTH_SECRET) {
                try {
                    const payload = jwt.verify(bearerToken, CONFIG.AUTH_SECRET) as Record<string, any>;
                    const user = buildUserFromJwt(payload);
                    if (user) {
                        req.user = user;
                        sessionCache.set(bearerToken, user, SESSION_CACHE_TTL_MS);
                        return next();
                    }
                } catch (err: unknown) {
                    logger.debug('[AUTH MIDDLEWARE] JWT validation fallback: %s', (err as any)?.message || 'invalid token');
                }
            }
        }

        const session = await auth.api.getSession({
            headers: authHeaders as any
        });

        if (!session) {
            logger.warn('[AUTH MIDDLEWARE] Sesión inválida. Authorization:', req.headers.authorization);
            return res.status(401).json({
                success: false,
                message: "No autorizado: Sesión inválida o expirada"
            });
        }

        logger.info('[AUTH MIDDLEWARE] Session validated for user', { userId: session.user?.id });
        req.user = session.user;
        if (bearerToken) {
            sessionCache.set(bearerToken, session.user, SESSION_CACHE_TTL_MS);
        }

        next();
    } catch (error: unknown) {
        logger.error('[AUTH MIDDLEWARE] Error al validar sesión: %o', error as any);
        return res.status(500).json({
            success: false,
            message: "Error interno al verificar autenticación"
        });
    }
};

// Exported function isAdmin.
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado: Se requieren privilegios de administrador"
        });
    }
    next();
};

// Exported function isSeller.
export const isSeller = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || (req.user.role !== 'seller' && req.user.role !== 'admin')) {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado: Solo los vendedores pueden realizar esta acción"
        });
    }
    next();
};
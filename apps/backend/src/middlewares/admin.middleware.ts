// File: src/middlewares/admin.middleware.ts
// Module responsible for backend functionality.

import { Request, Response, NextFunction } from 'express';
import logger from '@/logger/index.js';

type Role = 'buyer' | 'seller' | 'admin';

// Exported function requireRole.
export function requireRole(requiredRole: Role) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'No autenticado. Por favor inicia sesión.'
            });
            return;
        }

        const hasAccess = user.role === 'admin' || user.role === requiredRole;

        if (!hasAccess) {
            logger.warn(`[AUTH_BLOCKED] User ${user.id} con rol [${user.role}] intentó acceder a ruta requerida para [${requiredRole}]`);

            res.status(403).json({
                success: false,
                message: 'No tienes permisos suficientes para realizar esta acción.'
            });
            return;
        }

        next();
    };
}

// Middleware that applies admin behavior.
export const adminMiddleware = requireRole('admin');
// Middleware that applies seller behavior.
export const sellerMiddleware = requireRole('seller');
// Middleware that applies buyer behavior.
export const buyerMiddleware = requireRole('buyer');
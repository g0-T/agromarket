// File: src/middlewares/validate.middleware.ts
// Module responsible for backend functionality.

import { Request, Response, NextFunction } from 'express';
import logger from '@/logger/index.js';
import { ZodSchema, ZodError } from 'zod';
import { sanitizeObject } from '@/utils/sanitize.js';

// Exported function validateBody.
export function validateBody<T>(schema: ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            logger.debug('[VALIDATE] Raw req.body:', req.body);
            req.body = sanitizeObject(req.body);
            logger.debug('[VALIDATE] Sanitized req.body:', req.body);

            const result = schema.safeParse(req.body);
            if (!result.success) {
                logger.debug('[VALIDATE] Validation failed:', result.error.issues);
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: result.error.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
                return;
            }

            req.body = result.data as T;
            logger.debug('[VALIDATE] Validation passed, final req.body:', req.body);
            next();
        } catch (error) {
            logger.error('[VALIDATE] Unexpected error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error during validation',
            });
        }
    };
}
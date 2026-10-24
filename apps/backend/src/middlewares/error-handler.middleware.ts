// File: src/middlewares/error-handler.middleware.ts
// Module responsible for backend functionality.

import { Request, Response, NextFunction } from 'express';
import { CONFIG } from '@/config/env.config.js';
import logger from '@/logger/index.js';

// Exported function errorHandler.
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`[${req.method}] ${req.url} - Error: ${err.message}`, {
    stack: CONFIG.NODE_ENV === 'development' ? err.stack : undefined
  });

  const status = err.statusCode || err.status || 500;

  let message = err.message || 'Internal Server Error';

  if (CONFIG.NODE_ENV === 'production' && status === 500) {
    message = 'Ha ocurrido un error inesperado en el servidor';
  }

  res.status(status).json({
    success: false,
    message: message,
    ...(CONFIG.NODE_ENV === 'development' && { stack: err.stack })
  });
}
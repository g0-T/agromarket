// File: src/logger/index.ts
// Module responsible for backend functionality.

import winston from 'winston';
import { CONFIG } from '@/config/env.config.js';

const isProduction = CONFIG.NODE_ENV === 'production';

const logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    defaultMeta: { service: 'jr-agro-marketplace-backend', env: CONFIG.NODE_ENV },
    format: isProduction
        ? winston.format.json()
        : winston.format.combine(winston.format.colorize(), winston.format.simple()),
    transports: [
        new winston.transports.Console(),
    ],
    exitOnError: false,
});

// Default export for module usage.
export default logger;

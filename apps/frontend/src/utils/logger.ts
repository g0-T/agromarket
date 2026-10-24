// File: frontend/src/utils/logger.ts
// Lightweight wrapper around console logging and Sentry reporting.

import { captureException, captureMessage } from './sentry';

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

const formatArgs = (args: any[]) => args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2))).join(' ');

// Logger API
const logger = {
    debug: (...args: any[]) => {
        if (isDev) {
            console.debug(...args);
        }
    },
    info: (...args: any[]) => {
        if (isDev) {
            console.info(...args);
        }
    },
    warn: (...args: any[]) => {
        if (isDev) {
            console.warn(...args);
        } else {
            captureMessage(formatArgs(args), 'warning');
        }
    },
    error: (error: unknown, extra?: Record<string, unknown>) => {
        if (isDev) {
            console.error(error, extra);
        }
        captureException(error, extra);
    },
};

export default logger;

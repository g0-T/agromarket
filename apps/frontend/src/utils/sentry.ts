// File: frontend/src/utils/sentry.ts
// Lightweight wrappers around Sentry initialization and capture.

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Lightweight SeverityLevel type to avoid depending on @sentry/types here
export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

// Runtime configuration
const expoDsn = (Constants.expoConfig?.extra as Record<string, unknown> | undefined)?.sentryDsn as string | undefined;
const dsn = expoDsn || (process.env as any).EXPO_PUBLIC_SENTRY_DSN;
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';
const environment = isDev ? 'development' : 'production';
export const isSentryEnabled = Boolean(dsn) && Platform.OS !== 'web';
let sentryInitialized = false;
let Sentry: typeof import('@sentry/react-native') | null = null;

// Initialize Sentry if configured and not already started.
export async function initSentry() {
    if (!isSentryEnabled || sentryInitialized || Platform.OS === 'web') return;

    const sentryModule = await import('@sentry/react-native');
    Sentry = sentryModule;

    Sentry.init({
        dsn,
        environment,
        tracesSampleRate: environment === 'production' ? 0.05 : 0.0,
    });

    sentryInitialized = true;
}

// Capture an exception and send it to Sentry if enabled.
export function captureException(error: unknown, extra?: Record<string, unknown>) {
    if (!isSentryEnabled || !sentryInitialized || !Sentry) return;

    Sentry.captureException(error, { extra });
}

// Capture a log message in Sentry.
export function captureMessage(message: string, level: SeverityLevel = 'error') {
    if (!isSentryEnabled || !sentryInitialized || !Sentry) return;

    Sentry.captureMessage(message, level);
}

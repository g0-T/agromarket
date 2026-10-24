// File: src/config/env.config.ts
// Module responsible for backend functionality.

import 'dotenv/config';

const normalizeUrl = (value?: string) => value?.trim().replace(/\/+$|\s+$/g, '') || undefined;

const requireEnv = (name: string, value?: string) => {
    if (!value || !value.trim()) {
        throw new Error(`[Config Error] Missing required environment variable: ${name}`);
    }
    return value.trim();
};

const parseCertificate = (raw?: string) => {
    if (!raw) return undefined;
    const trimmed = raw.trim();
    if (trimmed.startsWith('-----BEGIN')) return trimmed;
    try {
        const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
        return decoded.startsWith('-----BEGIN') ? decoded : trimmed;
    } catch {
        return trimmed;
    }
};

const parseNumber = (value?: string, fallback?: number) => {
    if (!value || !value.trim()) return fallback;
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : fallback;
};

const splitList = (value?: string) => (value || '')
    .split(/[,;]+/)
    .map(item => item.trim())
    .filter(Boolean);

const trustedOriginsFromEnv = splitList(process.env.TRUSTED_ORIGINS);
const corsAllowedOrigins = splitList(process.env.CORS_ALLOWED_ORIGINS);

// --- Base Validations ---
const isProduction = process.env.NODE_ENV?.trim() === 'production';

// Base URLs are required in production
const backendUrl = isProduction
    ? requireEnv('BACKEND_URL', process.env.BACKEND_URL)
    : normalizeUrl(process.env.BACKEND_URL);

const frontendUrl = isProduction
    ? requireEnv('FRONTEND_URL', process.env.FRONTEND_URL)
    : normalizeUrl(process.env.FRONTEND_URL);

const betterAuthUrl = normalizeUrl(process.env.BETTER_AUTH_URL) || (backendUrl ? `${backendUrl}/api/auth` : undefined);

// Database and Storage
const databaseUrl = isProduction
    ? requireEnv('DATABASE_CONNECTION_STRING', process.env.DATABASE_CONNECTION_STRING)
    : (process.env.DATABASE_CONNECTION_STRING || '').trim().replace(/\r/g, '');

const storageProvider = isProduction
    ? requireEnv('STORAGE_PROVIDER', process.env.STORAGE_PROVIDER).trim().toLowerCase()
    : (process.env.STORAGE_PROVIDER || 'local').trim().toLowerCase();

const storageConnectionString = isProduction
    ? requireEnv('STORAGE_CONNECTION_STRING', process.env.STORAGE_CONNECTION_STRING)
    : (process.env.STORAGE_CONNECTION_STRING || './uploads').trim();

export const CONFIG = {
    NODE_ENV: process.env.NODE_ENV?.trim() || 'development',
    PORT: Number(process.env.PORT) || 5000,
    IS_PRODUCTION: isProduction,

    // Database
    DATABASE_CONNECTION_STRING: databaseUrl,
    DATABASE_CONNECTION_LIMIT: parseNumber(process.env.DATABASE_CONNECTION_LIMIT, 10),
    DATABASE_SSL_MODE: (process.env.DATABASE_SSL_MODE || 'disable').trim().toLowerCase(),
    DATABASE_SSL_CA: parseCertificate(process.env.DATABASE_SSL_CA),

    // Storage
    STORAGE_PROVIDER: storageProvider,
    STORAGE_CONNECTION_STRING: storageConnectionString,

    // URLs
    BACKEND_URL: backendUrl,
    BETTER_AUTH_URL: betterAuthUrl,
    FRONTEND_URL: frontendUrl,
    TRUSTED_ORIGINS: trustedOriginsFromEnv,
    CORS_ALLOWED_ORIGINS: corsAllowedOrigins,

    // Secrets with strict validation in production
    get AUTH_SECRET() {
        const secret = process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET;
        if (!secret) {
            if (isProduction) throw new Error('Critical: Neither BETTER_AUTH_SECRET nor JWT_SECRET was found in production.');
            return 'dev_secret_key_123';
        }
        return secret.trim();
    },

    get REFRESH_SECRET() {
        const secret = process.env.REFRESH_SECRET || process.env.BETTER_AUTH_SECRET;
        if (!secret) {
            if (isProduction) throw new Error('Critical: Neither REFRESH_SECRET nor BETTER_AUTH_SECRET was found in production.');
            return 'dev_refresh_key_456';
        }
        return secret.trim();
    },

    get CHAT_ENCRYPTION_KEY() {
        const key = process.env.CHAT_ENCRYPTION_KEY || process.env.BETTER_AUTH_SECRET;
        if (!key) {
            if (isProduction) throw new Error('Critical: Neither CHAT_ENCRYPTION_KEY nor BETTER_AUTH_SECRET was found in production.');
            return 'dev_chat_encryption_key_789';
        }
        return key.trim();
    },

    get SSL_CONFIG() {
        if (this.DATABASE_SSL_MODE === 'disable') {
            return false;
        }

        const config: { rejectUnauthorized: boolean; ca?: string } = {
            rejectUnauthorized: this.DATABASE_SSL_MODE !== 'require'
        };

        if (this.DATABASE_SSL_CA) {
            config.ca = this.DATABASE_SSL_CA;
        }

        if (isProduction && this.DATABASE_SSL_MODE === 'verify-full' && !config.ca) {
            throw new Error('DATABASE_SSL_CA is required in production when DATABASE_SSL_MODE=verify-full.');
        }

        return config;
    }
};
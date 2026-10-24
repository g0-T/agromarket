// File: src/auth.ts
// Module responsible for backend functionality.

import { betterAuth } from 'better-auth';
import { bearer, emailOTP } from 'better-auth/plugins';
import { kyselyAdapter } from '@better-auth/kysely-adapter';
import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import logger from '@/logger/index.js';
import { sendMail } from '@/utils/email.js';
import { CONFIG } from '@/config/env.config.js';

const { Pool } = pg;

const pool = new Pool({
    connectionString: CONFIG.DATABASE_CONNECTION_STRING,
    max: 10,
    ssl: CONFIG.SSL_CONFIG,
});

const db = new Kysely<any>({
    dialect: new PostgresDialect({ pool })
});

const authSecret = CONFIG.AUTH_SECRET;
const authBaseUrl = CONFIG.BETTER_AUTH_URL;

if (!authBaseUrl) {
    throw new Error('BETTER_AUTH_URL cannot be empty. Set BETTER_AUTH_URL in the production environment.');
}

const trustedOrigins = [
    CONFIG.FRONTEND_URL,
    CONFIG.BACKEND_URL,
    ...CONFIG.TRUSTED_ORIGINS,
].filter(Boolean) as string[];

const socialProviders = {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID.trim(),
                clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
            }
        }
        : {})
};

export const auth = betterAuth({
    database: kyselyAdapter(db, {
        type: 'postgres'
    }),
    baseURL: authBaseUrl,
    secret: authSecret,
    trustedOrigins,
    advanced: {
        useSecureCookies: false,
    },
    emailAndPassword: {
        enabled: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: false,
    },
    plugins: [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            sendVerificationOTP: async ({ email, otp, type }) => {
                logger.info(`[BACKEND OTP] Generating and sending OTP for ${email}: ${otp} (${type})`);

                if (type === 'email-verification' || type === 'sign-in' || type === 'forget-password') {
                    logger.info(`[BACKEND OTP] Sending email to ${email} with OTP ${otp}`);
                    await sendMail({
                        to: email,
                        subject: `${otp} es tu código de verificación - AgroMarket`,
                        html: `<h1>Código de verificación</h1><p>Tu código para la acción de ${type} es: <strong>${otp}</strong></p>`
                    });
                    logger.info(`[BACKEND OTP] Email successfully sent to ${email}`);
                } else {
                    logger.info(`[BACKEND OTP] Type ${type} not supported, no email sent`);
                }
            },
        }),
    ],
    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'buyer',
            },
            phone: { type: 'string' },
            phoneVerified: { type: 'boolean', defaultValue: false },
        },
    },
    socialProviders,
});
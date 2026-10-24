// File: src/services/otp.service.ts
// Module responsible for backend functionality.

import { randomInt } from 'node:crypto';
import logger from '@/logger/index.js';
import { sendMail } from '@/utils/email.js';
import { sendSms } from '@/utils/sms.js';
import prisma from '@/utils/prisma.js';
import { otpEmailTemplate } from '@/templates/otp-email.template.js';

type OtpType = 'email' | 'phone';

// Generate a per-request OTP that is not fixed or predictable.
const generateOtp = (length: number = 6): string => {
    const min = Number.parseInt('1'.padEnd(length, '0'), 10);
    const max = Number.parseInt('9'.repeat(length), 10);
    return randomInt(min, max + 1).toString().padStart(length, '0');
};

// Service that manages otp operations.
export const OtpService = {
    async sendOtp(type: OtpType, identifier: string, ip?: string) {
        const now = new Date();
        const isEmail = type === 'email';

        const oneHourAgo = new Date(now.getTime() - 3600000).toISOString();
        const recentCount = await prisma.verificationToken.count({
            where: {
                identifier,
                createdAt: {
                    gte: new Date(oneHourAgo)
                }
            }
        });

        if (recentCount >= 10) {
            const err: any = new Error('Demasiados intentos. Prueba en una hora.');
            err.statusCode = 429;
            throw err;
        }

        const otp = generateOtp(6);
        const expires = new Date(now.getTime() + 15 * 60000);

        await prisma.verificationToken.create({
            data: {
                identifier,
                token: otp,
                expires,
                ip
            }
        });

        if (isEmail) {
            await sendMail({
                to: identifier,
                subject: `${otp} es tu código de verificación - AgroMarket`,
                html: otpEmailTemplate(otp)
            });
            await prisma.user.update({
                where: { email: identifier },
                data: { lastOtpSent: now }
            });
        } else {
            await sendSms({
                to: identifier,
                body: `Tu código de AgroMarket es: ${otp}`
            });

            logger.info(`[SMS-OTP] SMS send simulation completed.`);
        }

        return { success: true };
    },

    async verifyOtp(identifier: string, token: string) {
        const now = new Date().toISOString();

        const verification = await prisma.verificationToken.findFirst({
            where: {
                identifier,
                token,
                expires: {
                    gt: new Date(now)
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!verification) {
            return { success: false, message: 'Código inválido o expirado' };
        }

        await prisma.verificationToken.delete({
            where: { token }
        });

        // If the identifier is a phone number, update the user record with boolean verification.
        const cleanPhone = identifier.replace(/[\s\-()]/g, '');

        if (cleanPhone.match(/^\+\d+$/)) {
            logger.debug(`[DEBUG] Attempting to update DB for phone: "${cleanPhone}"`);

            try {
                const updatedUser = await prisma.user.update({
                    where: { phone: cleanPhone },
                    data: { phoneVerified: true },
                });
                logger.info(`[DB-SUCCESS] User updated: ${updatedUser.email}`);
            } catch (error) {
                logger.error('[DB-ERROR] Error updating phoneVerified:', error);
                logger.warn(`[DB-WARN] No user found with phone: ${cleanPhone}`);
            }
        }

        return { success: true };
    }
};
// File: src/utils/email.ts
// Module responsible for backend functionality.

import { Resend } from 'resend';
import logger from '@/logger/index.js';

const resendApiKey = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM || 'AgroMarket <noreply@agromarket.com>';

if (!resendApiKey) {
    logger.error('RESEND_API_KEY no configurada en las variables de entorno.');
}

const resend = new Resend(resendApiKey);

interface SendMailProps {
    to: string | string[];
    subject: string;
    html: string;
}

export async function sendMail({ to, subject, html }: SendMailProps) {
    if (!resendApiKey) {
        logger.warn('[RESEND] Intento de envío de correo sin API Key configurada.');
        return { success: false, error: 'No API Key' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        });

        if (error) {
            logger.error('[RESEND] Fallo en la validación o envío de Resend', {
                error,
                destinatario: to,
                asunto: subject
            });
            throw new Error(error.message);
        }

        logger.info('[RESEND] Email enviado satisfactoriamente', {
            id: data?.id,
            to
        });

        return { success: true, id: data?.id };

    } catch (error: any) {
        logger.error('[RESEND] Error crítico en el servicio de correo', {
            message: error?.message || error,
            to,
            subject
        });

        throw error;
    }
}
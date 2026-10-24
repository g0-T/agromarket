// File: src/utils/sms.ts
// Module responsible for backend functionality.

import twilio from 'twilio';
import logger from '@/logger/index.js';

logger.info('Twilio env check', {
    SID: process.env.TWILIO_ACCOUNT_SID ? 'Cargado' : 'Faltante',
    TOKEN: process.env.TWILIO_AUTH_TOKEN ? 'Cargado' : 'Faltante',
    FROM: process.env.TWILIO_PHONE_FROM ? 'Cargado' : 'Faltante',
});

const client = twilio(process.env.TWILIO_ACCOUNT_SID as string, process.env.TWILIO_AUTH_TOKEN as string);
const from = process.env.TWILIO_PHONE_FROM;

export async function sendSms({ to, body }: { to: string; body: string }) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !from) {
        throw new Error('Twilio no está configurado: revisa TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_PHONE_FROM');
    }
    return client.messages.create({
        body,
        from,
        to,
    });
}

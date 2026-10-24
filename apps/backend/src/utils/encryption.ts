// File: src/utils/encryption.ts
// Helpers for message encryption and decryption.

import crypto from 'crypto';
import { CONFIG } from '@/config/env.config.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const PREFIX = 'ENC:';

const encryptionKey = crypto.createHash('sha256')
    .update(CONFIG.CHAT_ENCRYPTION_KEY, 'utf8')
    .digest();

const encode = (buffer: Buffer) => buffer.toString('base64');
const decode = (value: string) => Buffer.from(value, 'base64');

export const encryptText = (text: string) => {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${PREFIX}${encode(Buffer.concat([iv, authTag, encrypted]))}`;
};

export const decryptText = (payload: string) => {
    if (!payload || !payload.startsWith(PREFIX)) return payload;
    const data = decode(payload.slice(PREFIX.length));
    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
};

export const hashToken = (token: string) => {
    if (!token) return token;
    return crypto.createHmac('sha256', encryptionKey).update(token).digest('hex');
};

export const verifyTokenHash = (token: string, hash: string) => {
    if (!token || !hash) return false;
    const tokenHash = hashToken(token);
    const tokenBuffer = Buffer.from(tokenHash, 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    if (tokenBuffer.length !== hashBuffer.length) return false;
    return crypto.timingSafeEqual(tokenBuffer, hashBuffer);
};

export const isEncryptedText = (value: string) => typeof value === 'string' && value.startsWith(PREFIX);

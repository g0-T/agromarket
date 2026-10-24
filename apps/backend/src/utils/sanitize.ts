// File: src/utils/sanitize.ts
// Module responsible for backend functionality.

import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
// JSDOM's window type may not exactly match the DOMPurify WindowLike typedefs.
// Cast the factory to any to avoid TS type incompatibilities in the server environment.
const DOMPurifyServer = (DOMPurify as any)(window);

// Exported function sanitizeString.
export function sanitizeString(input: string): string {
    return DOMPurifyServer.sanitize(input, { ALLOWED_TAGS: [] }).trim();
}

// Exported function sanitizeObject.
export function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }
    return obj;
}
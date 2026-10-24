// File: src/services/currency.service.ts
// Module responsible for backend functionality.

import prisma from '@/utils/prisma.js';
import axios from 'axios';
import logger from '@/logger/index.js';
import { MemoryCache } from '@/utils/memory-cache.js';

// Service that manages currency operations.
export class CurrencyService {
    private static readonly RATE_KEY = 'bcv_rate';
    private static readonly CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutos
    private static readonly cache = new MemoryCache();

    static async fetchBCVRate(): Promise<number | null> {
        const sources = [
            'https://ve.dolarapi.com/v1/dolares/oficial',
        ];

        for (const url of sources) {
            try {
                const { data } = await axios.get(url, { timeout: 8000 });
                const rate = data.promedio || data.price;

                if (typeof rate === 'number' && !isNaN(rate) && rate > 0) {
                    return rate;
                }
            } catch (error: any) {
                logger.warn(`[CURRENCYSERVICE] Falló fuente ${url}: ${error.message}`);
            }
        }
        return null;
    }

    static async syncRateToDB(): Promise<void> {
        try {
            const rate = await this.fetchBCVRate();

            if (!rate) {
                logger.error('[CURRENCYSERVICE] No se pudo obtener tasa de ninguna fuente. Se mantiene la anterior.');
                return;
            }

            const updatedAt = new Date();
            await prisma.appConfig.upsert({
                where: { key: this.RATE_KEY },
                create: {
                    key: this.RATE_KEY,
                    value: rate,
                    updatedAt
                },
                update: {
                    value: rate,
                    updatedAt
                }
            });

            this.cache.set(this.RATE_KEY, { rate, updatedAt }, this.CACHE_TTL_MS);
            logger.info(`[CURRENCYSERVICE] Tasa actualizada con éxito: ${rate} VES`);
        } catch (err) {
            logger.error('[CURRENCYSERVICE] Error en syncRateToDB: %o', err);
        }
    }

    static async getStoredRate(): Promise<number> {
        try {
            const meta = await this.getStoredRateMeta();
            return meta.rate;
        } catch (err) {
            return 0;
        }
    }

    static async getStoredRateMeta(): Promise<{ rate: number; updatedAt: Date | null }> {
        const cached = this.cache.get<{ rate: number; updatedAt: Date | null }>(this.RATE_KEY);
        if (cached) {
            return cached;
        }

        try {
            const rateRecord = await prisma.appConfig.findUnique({
                where: { key: this.RATE_KEY }
            });

            if (!rateRecord) {
                return { rate: 0, updatedAt: null };
            }

            const meta = {
                rate: rateRecord.value,
                updatedAt: rateRecord.updatedAt || null,
            };
            this.cache.set(this.RATE_KEY, meta, this.CACHE_TTL_MS);
            return meta;
        } catch (err) {
            return { rate: 0, updatedAt: null };
        }
    }
}
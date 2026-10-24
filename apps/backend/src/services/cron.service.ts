// File: src/services/cron.service.ts
// Module responsible for backend functionality.

import cron from 'node-cron';
import { CurrencyService } from '@/services/currency.service.js';
import prisma from '@/utils/prisma.js';
import logger from '@/logger/index.js';
import { runDbAsAdmin } from '@/utils/db-session.js';

// Exported function initCronJobs.
export const initCronJobs = () => {
    cron.schedule('30 9,16 * * 1-5', async () => {
        logger.info('[CRON] Ejecutando actualización programada de tasa...');
        await attemptSync();
    });

    cron.schedule('*/30 * * * *', async () => {
        const { updatedAt } = await CurrencyService.getStoredRateMeta();
        const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

        if (!updatedAt || updatedAt < threeHoursAgo) {
            logger.warn('[CRON] Tasa desactualizada detectada. Intentando refuerzo...');
            await attemptSync();
        }
    });

    cron.schedule('0 * * * *', async () => {
        logger.info('[CRON] Verificando transacciones abandonadas para expirar...');

        const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

        const result = await runDbAsAdmin(async (tx) => {
            return tx.transaction.updateMany({
                where: {
                    status: 'pending',
                    createdAt: { lt: new Date(cutoff) }
                },
                data: { status: 'expired' }
            });
        });

        logger.info(`[CRON] Limpieza completada. Transacciones expiradas: ${result.count}`);
    });

    cron.schedule('0 */3 * * *', async () => {
        logger.info('[CRON] Limpiando ubicaciones y tokens expirados de transacciones completadas...');

        const now = new Date();
        const cleanup = await runDbAsAdmin(async (tx) => {
            return tx.transaction.updateMany({
                where: {
                    status: 'completed',
                    locationExpiresAt: { lt: now }
                },
                data: {
                    buyerDeliveryAddress: null,
                    buyerDeliveryLat: null,
                    buyerDeliveryLng: null,
                    deliveryToken: null,
                    deliveryTokenEncrypted: null,
                    deliveryTokenExpiresAt: null,
                    locationExpiresAt: null,
                }
            });
        });

        logger.info(`[CRON] Ubicaciones eliminadas de transacciones completadas: ${cleanup.count}`);
    });
};

async function attemptSync() {
    try {
        await CurrencyService.syncRateToDB();
    } catch (err) {
        logger.error('[CRON] Fallo crítico en attemptSync: %o', err);
    }
}
// File: src/sync.ts
// Module responsible for backend functionality.

import { CurrencyService } from '@/services/currency.service.js';
import logger from '@/logger/index.js';

async function main() {
    try {
        logger.info('[SYNC] Iniciando sincronización manual de tasa BCV...');

        await CurrencyService.syncRateToDB();
        const rate = await CurrencyService.getStoredRate();

        logger.info(`[SYNC] Tasa actualizada exitosamente: ${rate} VES/USD`);

        process.exit(0);
    } catch (error) {
        logger.error('[SYNC] Error crítico en la sincronización manual: %o', error);
        process.exit(1);
    }
}

main();
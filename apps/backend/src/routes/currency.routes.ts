// File: src/routes/currency.routes.ts
// Module responsible for backend functionality.

import { Router } from 'express';
import { CurrencyService } from '@/services/currency.service.js';
import { isAuth } from '@/middlewares/auth.middleware.js';
import { requireRole } from '@/middlewares/admin.middleware.js';

const router = Router();

router.get('/rate', async (req, res) => {
    try {
        const { rate, updatedAt } = await CurrencyService.getStoredRateMeta();

        const needsRefresh = !rate || !updatedAt || (Date.now() - updatedAt.getTime() > 60 * 60 * 1000);

        if (needsRefresh) {
            CurrencyService.syncRateToDB().catch(() => { });
        }

        res.json({ success: true, rate, updatedAt });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener la tasa' });
    }
});

router.get('/rate/update',
    isAuth,
    requireRole('admin'),
    async (req, res) => {
        try {
            await CurrencyService.syncRateToDB();
            const newRate = await CurrencyService.getStoredRate();
            res.json({
                success: true,
                rate: newRate,
                message: 'Tasa actualizada exitosamente por el administrador'
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: `Error: ${error.message}` });
        }
    });

// Default export for module usage.
export default router;
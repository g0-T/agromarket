// File: src/routes/admin.routes.ts
// Module responsible for backend functionality.

import { Router } from 'express';
import { adminListTransactions, adminResolveTransaction } from '@/controllers/transaction.controller.js';
import { adminListDisputes, adminResolveDispute } from '@/controllers/dispute.controller.js';
import { isAuth } from '@/middlewares/auth.middleware.js';
import { requireRole } from '@/middlewares/admin.middleware.js';
import { validateBody } from '@/middlewares/validate.middleware.js';
import { adminResolveTransactionSchema, adminResolveDisputeSchema } from '@/validators/transaction.validators.js';

const router = Router();

router.get('/transactions', isAuth, requireRole('admin'), adminListTransactions);
router.put('/transactions/:id/resolve', isAuth, requireRole('admin'), validateBody(adminResolveTransactionSchema), adminResolveTransaction);

// Dispute admin routes
router.get('/disputes', isAuth, requireRole('admin'), adminListDisputes);
router.put('/disputes/:id/resolve', isAuth, requireRole('admin'), validateBody(adminResolveDisputeSchema), adminResolveDispute);

// Default export for module usage.
export default router;
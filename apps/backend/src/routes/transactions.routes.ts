// File: src/routes/transactions.routes.ts
// Module responsible for backend functionality.

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { createTransaction, listUserTransactions, getTransaction, postChatMessage, uploadProof, completeTransaction, sendLot, updateDeliveryLocation, verifyDeliveryToken } from '@/controllers/transaction.controller.js';
import { createDispute, listUserDisputes } from '@/controllers/dispute.controller.js';
import { isAuth } from '@/middlewares/auth.middleware.js';
import { validateBody } from '@/middlewares/validate.middleware.js';
import { createTransactionSchema, chatMessageSchema, createDisputeSchema, deliveryLocationSchema, verifyDeliveryTokenSchema } from '@/validators/transaction.validators.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const disputeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images allowed for disputes.'));
    }
  },
});

router.post('/', isAuth, validateBody(createTransactionSchema), createTransaction);

router.get('/', isAuth, listUserTransactions);
router.get('/:id', isAuth, getTransaction);

router.post('/:id/chat', isAuth, upload.single('attachment'), validateBody(chatMessageSchema), postChatMessage);

router.post('/:id/proof', isAuth, upload.single('proof'), uploadProof);

router.post('/:id/delivery-location', isAuth, validateBody(deliveryLocationSchema), updateDeliveryLocation);
router.post('/:id/send-lot', isAuth, sendLot);
router.post('/:id/verify-token', isAuth, validateBody(verifyDeliveryTokenSchema), verifyDeliveryToken);
router.post('/:id/complete', isAuth, completeTransaction);

// Dispute routes
router.post('/:id/dispute', isAuth, disputeUpload.array('photos', 3), validateBody(createDisputeSchema), createDispute);
router.get('/disputes', isAuth, listUserDisputes);

router.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError || (err.message && /Invalid file type/i.test(err.message))) {
    return res.status(400).json({
      success: false,
      message: 'Archivo no permitido o muy pesado (Máx 10MB). Solo JPG, PNG y PDF.'
    });
  }
  next(err);
});

// Default export for module usage.
export default router;
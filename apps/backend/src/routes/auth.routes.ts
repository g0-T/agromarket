// File: src/routes/auth.routes.ts
// Module responsible for backend functionality.

import { Router } from 'express';
import { sendPhoneOtpController, verifyPhoneOtpController } from '@/controllers/auth.controller.js';
import { validateVerifyOtp } from '@/validators/auth.validators.js';
import { otpRateLimit } from '@/middlewares/rate-limit.middleware.js';
import { isAuth } from '@/middlewares/auth.middleware.js';

const router = Router();

router.post('/phone/send-otp', otpRateLimit, sendPhoneOtpController);
router.post('/phone/verify-otp', validateVerifyOtp, verifyPhoneOtpController);

router.get('/verify', isAuth, (req, res) => {
  res.json({ success: true, user: (req as any).user });
});

// Default export for module usage.
export default router;
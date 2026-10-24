// File: src/controllers/auth.controller.ts
// Module responsible for backend functionality.

import { Request, Response } from 'express';
import { OtpService } from '@/services/otp.service.js';
import logger from '@/logger/index.js';

// Controller that handles sendphoneotp requests.
export const sendPhoneOtpController = async (req: Request, res: Response) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ success: false, message: 'Teléfono requerido' });
        }

        await OtpService.sendOtp('phone', phone, req.ip);
        res.json({ success: true, message: 'Código enviado' });
    } catch (error: any) {
        logger.error('Error sending phone OTP:', error);
        res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Error interno' });
    }
};

// Controller that handles verifyphoneotp requests.
export const verifyPhoneOtpController = async (req: Request, res: Response) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: 'Teléfono y OTP requeridos' });
        }

        const result = await OtpService.verifyOtp(phone, otp);
        if (result.success) {
            logger.info(`[AUTH] Teléfono ${phone} verificado exitosamente.`);

            return res.json({
                success: true,
                message: 'Teléfono verificado',
                verifiedAt: new Date().toISOString()
            });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error: any) {
        logger.error('Error verifying phone OTP:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};
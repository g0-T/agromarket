// File: src/controllers/sellerApplication.controller.ts
// Module responsible for backend functionality.

import { Request, Response } from 'express';
import { sellerService, decryptSellerApplication } from '@/services/seller.service.js';
import { uploadFile, deleteFiles } from '@/utils/storage.js';
import logger from '@/logger/index.js';
import { sanitizeFileName } from '@/utils/file-helpers.js';

// Exported function submitApplication.
export const submitApplication = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const uploadedFileNames: string[] = [];

    try {
        logger.info('[SELLER_APP] Starting submission for user', { userId });

        if (!userId) return res.status(401).json({ success: false, message: 'No autorizado' });

        const files = (req.files as Express.Multer.File[]) || [];
        logger.info('[SELLER_APP] Files received', { count: files.length, files: files.map(f => ({ name: f.originalname, fieldname: f.fieldname })) });

        if (files.length < 2) return res.status(400).json({ success: false, message: 'Se requieren Cédula y Hierro.' });

        const existingApp = await sellerService.getActiveApplication(userId);
        logger.info('[SELLER_APP] Existing application check', { existingApp });

        if (existingApp) {
            const msg = existingApp.status === 'pending'
                ? 'Ya tienes una solicitud pendiente.'
                : 'Tu cuenta está bloqueada para nuevas solicitudes.';
            return res.status(400).json({ success: false, message: msg });
        }

        const filesData = await Promise.all(files.map(async (file) => {
            const fileName = `verif_${userId}_${Date.now()}_${sanitizeFileName(file.originalname)}`;
            logger.info('[SELLER_APP] Uploading file', { originalName: file.originalname, generatedName: fileName });

            const { url, key } = await uploadFile(file, 'seller-applications');

            uploadedFileNames.push(key);

            const isHierro = file.originalname.toLowerCase().includes('hierro') || file.fieldname === 'hierro';

            return {
                url: url,
                filename: file.originalname,
                mimeType: file.mimetype,
                type: isHierro ? 'hierro' : 'cedula'
            };
        }));

        logger.info('[SELLER_APP] Files processed', { filesData });

        const lat = req.body.farmLocationLat !== undefined && req.body.farmLocationLat !== '' ? parseFloat(req.body.farmLocationLat) : undefined;
        const lng = req.body.farmLocationLng !== undefined && req.body.farmLocationLng !== '' ? parseFloat(req.body.farmLocationLng) : undefined;
        const address = req.body.farmLocationAddress ? String(req.body.farmLocationAddress).trim() : undefined;

        const application = await sellerService.createApplication(userId, req.body.reason, filesData, lat, lng, address);
        logger.info('[SELLER_APP] Application created', { applicationId: application.id });

        return res.status(201).json({ success: true, data: decryptSellerApplication(application) });

    } catch (err: any) {
        if (uploadedFileNames.length > 0) {
            try {
                await deleteFiles(uploadedFileNames, 'seller-applications');
            } catch (storageErr) {
                logger.error('[ROLLBACK_ERROR] Failed to delete uploaded files during rollback: %o', storageErr);
            }
        }
        res.status(500).json({ success: false, message: 'Error interno al procesar la solicitud.' });
    }
};

// Exported function getApplications.
export const getApplications = async (req: Request, res: Response) => {
    try {
        const applications = await sellerService.getAllApplications();
        res.json({ success: true, data: applications });
    } catch (err: any) {
        logger.error('[GET_APPS_ERROR]: %o', err);
        res.status(500).json({ success: false, message: 'Error al obtener solicitudes.' });
    }
};

// Exported function getMyApplication.
export const getMyApplication = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const data = await sellerService.getMyApplication(userId);
        res.json({ success: true, data: data || null });
    } catch (err: any) {
        logger.error('[GET_MY_APP_ERROR]: %o', err);
        res.status(500).json({ success: false, message: 'Error al obtener tu solicitud.' });
    }
};

// Exported function approveApplication.
export const approveApplication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const app = await sellerService.getApplicationById(id);
        if (!app) return res.status(404).json({ success: false, message: 'Solicitud no encontrada.' });

        await sellerService.updateApplicationStatus(id, 'approved', notes);
        await sellerService.updateUserRole(app.userId, 'seller');

        res.json({ success: true, message: 'Vendedor aprobado con éxito.' });
    } catch (err: any) {
        logger.error('[APPROVE_ERROR]: %o', err);
        res.status(500).json({ success: false, message: 'Error al aprobar la solicitud.' });
    }
};

// Exported function rejectApplication.
export const rejectApplication = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { notes, isFinal } = req.body;

        const status = isFinal ? 'blocked_from_applying' : 'rejected';

        await sellerService.updateApplicationStatus(id, status, notes);

        res.json({ success: true, message: 'Solicitud rechazada.' });
    } catch (err: any) {
        logger.error('[REJECT_ERROR]: %o', err);
        res.status(500).json({ success: false, message: 'Error al rechazar la solicitud.' });
    }
};
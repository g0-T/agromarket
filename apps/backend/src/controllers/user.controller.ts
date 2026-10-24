// File: src/controllers/user.controller.ts
// Module responsible for backend functionality.

import { Request, Response } from 'express';
import prisma from '@/utils/prisma.js';
import { uploadFile, deleteFile } from '@/utils/storage.js';
import { sanitizeFileName, prefixUrl } from '@/utils/file-helpers.js';
import logger from '@/logger/index.js';

// Exported function updateProfile.
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { name } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Autenticación requerida' });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { image: true }
        });

        const updateData: any = {};
        if (name) updateData.name = name;

        if (req.file) {
            const { url: imageUrl, key: imageKey } = await uploadFile(req.file, 'user-avatars');
            updateData.image = imageUrl;

            if (currentUser?.image) {
                deleteFile(currentUser.image, 'user-avatars').catch(e =>
                    logger.error('Failed to delete old avatar: %o', e)
                );
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No se proporcionaron datos para actualizar' });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, role: true, image: true }
        });

        const responseData = {
            ...user,
            image: prefixUrl(user.image)
        };

        res.json({ success: true, data: responseData });

    } catch (err: any) {
        logger.error('[UPDATE_PROFILE_ERROR] userId: %s, error: %o', (req as any).user?.id, err);
        res.status(500).json({
            success: false,
            message: 'Error interno al actualizar el perfil'
        });
    }
};

// Exported function getUser.
export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, name: true, email: true, image: true, role: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({
            success: true,
            data: {
                ...user,
                image: prefixUrl(user.image)
            }
        });
    } catch (err: any) {
        logger.error('[GET_USER_ERROR] userId: %s, error: %o', req.params.id, err);
        res.status(500).json({ success: false, message: 'Error interno al obtener el usuario' });
    }
};
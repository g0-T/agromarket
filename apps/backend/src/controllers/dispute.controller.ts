// File: src/controllers/dispute.controller.ts
// Module responsible for backend functionality.

import { Request, Response } from 'express';
import prisma from '@/utils/prisma.js';
import logger from '@/logger/index.js';
import { uploadFile } from '@/utils/storage.js';
import { prefixUrl, sanitizeFileName } from '@/utils/file-helpers.js';
import { decryptSellerApplication } from '@/services/seller.service.js';
import { runDbAsAdmin, runDbAsUser } from '@/utils/db-session.js';
import { decryptText, encryptText } from '@/utils/encryption.js';

// Exported function createDispute.
export const createDispute = async (req: Request, res: Response) => {
    try {
        const { transactionId, reason } = req.body;
        const initiatorId = (req as any).user?.id;

        if (!initiatorId) return res.status(401).json({ success: false, message: 'Autenticación requerida' });
        if (!transactionId) return res.status(400).json({ success: false, message: 'Se requiere ID de transacción' });

        const initiatorRole = (req as any).user?.role || 'buyer';
        const transaction = await runDbAsUser(initiatorId, initiatorRole, async (tx) => {
            return tx.transaction.findUnique({
                where: { id: transactionId }
            });
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
        }

        if (transaction.buyerId !== initiatorId && transaction.sellerId !== initiatorId) {
            return res.status(403).json({ success: false, message: 'No autorizado' });
        }

        const existingDispute = await prisma.dispute.findFirst({
            where: {
                transactionId,
                status: 'open',
            },
            select: {
                id: true,
            },
        });

        if (existingDispute) {
            return res.status(400).json({ success: false, message: 'Ya existe una disputa para esta transacción' });
        }

        const dispute = await prisma.dispute.create({
            data: {
                transactionId,
                initiatorId,
                reason: typeof reason === 'string' && reason.trim().length > 0 ? encryptText(reason) : '',
                status: 'open',
            },
        });

        const attachments = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const { url: fileUrl } = await uploadFile(file, 'transaction-files');
                const attachment = await prisma.attachment.create({
                    data: {
                        type: 'dispute',
                        url: fileUrl,
                        uploaderId: initiatorId,
                        transactionId,
                        disputeId: dispute.id,
                        mimeType: file.mimetype,
                        filename: file.originalname,
                    },
                });
                attachments.push(attachment);
            }
        }

        await runDbAsUser(initiatorId, initiatorRole, async (tx) => {
            return tx.transaction.update({
                where: { id: transactionId },
                data: { status: 'disputed' },
            });
        });

        res.status(201).json({
            success: true,
            data: {
                ...dispute,
                reason: dispute.reason ? decryptText(dispute.reason) : dispute.reason,
                adminNotes: dispute.adminNotes ? decryptText(dispute.adminNotes) : dispute.adminNotes,
                attachments: attachments.map(att => ({ ...att, url: prefixUrl(att.url) }))
            }
        });
    } catch (err: any) {
        logger.error('Create dispute error: %s', err.message);
        res.status(500).json({ success: false, message: 'Error al crear la disputa' });
    }
};

// Exported function listUserDisputes.
export const listUserDisputes = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'buyer';
        const disputes = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.dispute.findMany({
                where: {
                    transaction: {
                        OR: [
                            { buyerId: userId },
                            { sellerId: userId }
                        ]
                    }
                },
                include: {
                    transaction: {
                        include: {
                            product: true,
                            buyer: true,
                            seller: true,
                        }
                    },
                    attachments: true
                },
                orderBy: { createdAt: 'desc' }
            });
        });

        const processed = disputes.map(dispute => ({
            ...dispute,
            reason: dispute.reason ? decryptText(dispute.reason) : dispute.reason,
            adminNotes: dispute.adminNotes ? decryptText(dispute.adminNotes) : dispute.adminNotes,
            attachments: dispute.attachments?.map(att => ({ ...att, url: prefixUrl(att.url) })) || []
        }));

        res.json({ success: true, data: processed });
    } catch (err) {
        logger.error('List user disputes error: %o', err);
        res.status(500).json({ success: false, message: 'Error al obtener disputas' });
    }
};

// Exported function adminListDisputes.
export const adminListDisputes = async (req: Request, res: Response) => {
    try {
        const disputes = await runDbAsAdmin(async (tx) => {
            return tx.dispute.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    transaction: {
                        include: {
                            product: true,
                            buyer: {
                                include: {
                                    sellerApplications: { include: { attachments: true } }
                                }
                            },
                            seller: {
                                include: {
                                    sellerApplications: { include: { attachments: true } }
                                }
                            }
                        }
                    },
                    initiator: true,
                    attachments: true
                }
            });
        });

        const processed = disputes.map(dispute => ({
            ...dispute,
            reason: dispute.reason ? decryptText(dispute.reason) : dispute.reason,
            adminNotes: dispute.adminNotes ? decryptText(dispute.adminNotes) : dispute.adminNotes,
            attachments: dispute.attachments?.map(att => ({ ...att, url: prefixUrl(att.url) })) || [],
            transaction: {
                ...dispute.transaction,
                buyer: {
                    ...dispute.transaction.buyer,
                    sellerApplications: dispute.transaction.buyer.sellerApplications?.map(app => ({
                        ...decryptSellerApplication(app),
                        attachments: app.attachments?.map(att => ({ ...att, url: prefixUrl(att.url) })) || []
                    })) || []
                },
                seller: {
                    ...dispute.transaction.seller,
                    sellerApplications: dispute.transaction.seller.sellerApplications?.map(app => ({
                        ...decryptSellerApplication(app),
                        attachments: app.attachments?.map(att => ({ ...att, url: prefixUrl(att.url) })) || []
                    })) || []
                }
            }
        }));

        res.json({ success: true, data: processed });
    } catch (err: any) {
        logger.error('Admin list disputes error: %o', err);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Exported function adminResolveDispute.
export const adminResolveDispute = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const dispute = await prisma.dispute.update({
            where: { id },
            data: { status, adminNotes: adminNotes ? encryptText(adminNotes) : undefined }
        });

        if (status === 'resolved') {
            await runDbAsAdmin(async (tx) => {
                return tx.transaction.update({
                    where: { id: dispute.transactionId },
                    data: { status: 'completed' }
                });
            });
        }

        res.json({
            success: true,
            data: {
                ...dispute,
                reason: dispute.reason ? decryptText(dispute.reason) : dispute.reason,
                adminNotes: dispute.adminNotes ? decryptText(dispute.adminNotes) : dispute.adminNotes,
            }
        });
    } catch (err) {
        logger.error('Admin resolve dispute error: %o', err);
        res.status(500).json({ success: false, message: 'Error al resolver la disputa' });
    }
};
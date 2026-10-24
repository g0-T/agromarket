// File: src/controllers/transaction.controller.ts
// Module responsible for backend functionality.

import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '@/utils/prisma.js';
import logger from '@/logger/index.js';
import { uploadFile } from '@/utils/storage.js';
import { prefixUrl, sanitizeFileName } from '@/utils/file-helpers.js';
import { transactionService } from '@/services/transaction.service.js';
import { decryptSellerApplication } from '@/services/seller.service.js';
import { decryptText, encryptText, hashToken, verifyTokenHash } from '@/utils/encryption.js';
import { getSocketServer } from '@/utils/socket.js';
import { runDbAsAdmin, runDbAsUser } from '@/utils/db-session.js';

const decryptTransactionLocation = (tx: any, includeDeliveryToken = false) => {
    const { deliveryToken, deliveryTokenEncrypted, ...rest } = tx;
    return {
        ...rest,
        ...(includeDeliveryToken && tx.status === 'in_transit' && deliveryTokenEncrypted &&
            tx.deliveryTokenExpiresAt && new Date(tx.deliveryTokenExpiresAt) > new Date()
            ? { deliveryToken: decryptText(deliveryTokenEncrypted) }
            : {}),
        adminNotes: typeof rest.adminNotes === 'string' ? decryptText(rest.adminNotes) : rest.adminNotes,
        buyerDeliveryAddress: typeof rest.buyerDeliveryAddress === 'string' ? decryptText(rest.buyerDeliveryAddress) : rest.buyerDeliveryAddress,
        buyerDeliveryLat: typeof rest.buyerDeliveryLat === 'string' ? decryptText(rest.buyerDeliveryLat) : rest.buyerDeliveryLat,
        buyerDeliveryLng: typeof rest.buyerDeliveryLng === 'string' ? decryptText(rest.buyerDeliveryLng) : rest.buyerDeliveryLng,
    };
};

const generateDeliveryToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Exported function createTransaction.
export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { productId, amount, currency, buyerDeliveryAddress, buyerDeliveryLat, buyerDeliveryLng } = req.body;
        const buyerId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'buyer';
        if (!buyerId) return res.status(401).json({ success: false, message: 'Autenticación requerida' });

        let created = false;
        const transaction = await runDbAsUser(buyerId, userRole, async (tx) => {
            const product = await tx.product.findUnique({ where: { id: Number(productId) } });
            if (!product) throw new Error('Product not found');
            if (product.sellerId === buyerId) throw new Error('No puedes comprar tu propio lote');

            await tx.$queryRaw`SELECT "id" FROM "Product" WHERE "id" = ${product.id} FOR UPDATE`;

            const existingTx = await tx.transaction.findFirst({
                where: {
                    productId: product.id,
                    buyerId,
                    status: { not: 'completed' }
                },
                include: {
                    product: true,
                    buyer: true,
                    seller: true,
                    attachments: true,
                    chatMessages: true,
                }
            });

            if (existingTx) {
                return existingTx;
            }

            await transactionService.checkActiveTransactions(product.id, buyerId, tx);

            const newTx = await transactionService.create({
                productId: product.id,
                buyerId,
                sellerId: product.sellerId,
                amount,
                currency: currency || 'VES',
                buyerDeliveryAddress: buyerDeliveryAddress ? encryptText(buyerDeliveryAddress) : undefined,
                buyerDeliveryLat: buyerDeliveryLat ? encryptText(buyerDeliveryLat) : undefined,
                buyerDeliveryLng: buyerDeliveryLng ? encryptText(buyerDeliveryLng) : undefined,
            }, tx);

            created = true;
            return newTx;
        });

        const status = created ? 201 : 200;
        res.status(status).json({ success: true, data: decryptTransactionLocation(transaction) });
    } catch (err: any) {
        logger.error(`Create tx error: ${err instanceof Error ? err.message : String(err)}`);
        res.status(400).json({ success: false, message: process.env.NODE_ENV === 'development' ? err.message : 'Error al crear la transacción' });
    }
};

// Exported function listUserTransactions.
export const listUserTransactions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'buyer';
        const transactions = await runDbAsUser(userId, userRole, async (tx) => {
            const where = {
                OR: [{ buyerId: userId }, { sellerId: userId }]
            };
            const include = {
                product: true,
                buyer: true,
                seller: true,
                attachments: true,
                chatMessages: { include: { sender: true } }
            };
            const found = await tx.transaction.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include
            });

            if (userId) {
                const now = new Date();
                for (const transaction of found) {
                    if (
                        transaction.buyerId !== userId ||
                        transaction.status !== 'in_transit' ||
                        (transaction.deliveryTokenEncrypted &&
                            transaction.deliveryTokenExpiresAt &&
                            transaction.deliveryTokenExpiresAt > now)
                    ) continue;

                    const token = generateDeliveryToken();
                    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    await tx.transaction.updateMany({
                        where: {
                            id: transaction.id,
                            buyerId: userId,
                            status: 'in_transit',
                            deliveryToken: transaction.deliveryToken,
                            deliveryTokenEncrypted: transaction.deliveryTokenEncrypted,
                            deliveryTokenExpiresAt: transaction.deliveryTokenExpiresAt,
                        },
                        data: {
                            deliveryToken: hashToken(token),
                            deliveryTokenEncrypted: encryptText(token),
                            deliveryTokenExpiresAt: expiresAt,
                        }
                    });
                }
            }

            return tx.transaction.findMany({ where, orderBy: { createdAt: 'desc' }, include });
        });

        const processed = transactions.map(tx => ({
            ...decryptTransactionLocation(tx, tx.buyerId === userId),
            buyerProof: prefixUrl(tx.buyerProof),
            attachments: tx.attachments.map(a => ({ ...a, url: prefixUrl(a.url) })),
            chatMessages: tx.chatMessages.map(m => ({
                ...m,
                text: typeof m.text === 'string' ? decryptText(m.text) : m.text,
                attachment: prefixUrl(m.attachment),
                sender: m.sender ? { ...m.sender, image: prefixUrl(m.sender.image) } : null
            }))
        }));

        res.json({ success: true, data: processed });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`List user transactions error: ${err instanceof Error ? err.stack || message : message}`);
        res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === 'development' ? message : 'Error al obtener transacciones'
        });
    }
};

// Exported function getTransaction.
export const getTransaction = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'buyer';
        const tx = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.findUnique({
                where: { id: req.params.id },
                include: {
                    product: true,
                    buyer: true,
                    seller: true,
                    attachments: true,
                    chatMessages: { include: { sender: true } }
                }
            });
        });

        if (!tx) return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
        if (tx.buyerId !== userId && tx.sellerId !== userId) return res.status(403).json({ success: false, message: 'No autorizado' });

        res.json({
            success: true,
            data: {
                ...decryptTransactionLocation(tx, tx.buyerId === userId),
                attachments: tx.attachments.map(a => ({ ...a, url: prefixUrl(a.url) })),
                chatMessages: tx.chatMessages.map(m => ({
                    ...m,
                    text: typeof m.text === 'string' ? decryptText(m.text) : m.text,
                    attachment: prefixUrl(m.attachment),
                    sender: m.sender ? { ...m.sender, image: prefixUrl(m.sender.image) } : null
                }))
            }
        });
    } catch (err) {
        logger.error('Get transaction error: %o', err);
        res.status(500).json({ success: false, message: 'Error interno al obtener la transacción' });
    }
};

// Exported function postChatMessage.
export const postChatMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'buyer';
        const { text } = req.body;
        let attachment: string | undefined;

        if (req.file) {
            const { url: attachmentUrl } = await uploadFile(req.file, 'transaction-files');
            attachment = attachmentUrl;
        }

        const encryptedText = typeof text === 'string' ? encryptText(text) : undefined;

        const transaction = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.findUnique({
                where: { id },
                select: {
                    buyerId: true,
                    sellerId: true,
                }
            });
        });

        if (!transaction || (transaction.buyerId !== userId && transaction.sellerId !== userId)) {
            return res.status(403).json({ success: false, message: 'No autorizado para enviar mensajes en esta transacción' });
        }

        const message = await prisma.chatMessage.create({
            data: {
                transactionId: id,
                senderId: userId,
                text: encryptedText,
                attachment
            },
            include: { sender: true }
        });

        if (attachment) {
            await prisma.attachment.create({
                data: {
                    type: 'chat',
                    url: attachment,
                    uploaderId: userId,
                    transactionId: id,
                    mimeType: req.file?.mimetype,
                    filename: req.file?.originalname
                }
            });
        }

        const decryptedMessage = {
            ...message,
            transactionId: id,
            text: typeof message.text === 'string' ? decryptText(message.text) : message.text,
            attachment: prefixUrl(message.attachment),
            senderId: message.senderId,
            sender: message.sender ? { ...message.sender, image: prefixUrl(message.sender.image) } : null
        };

        const io = getSocketServer();
        if (io) {
            io.to(`transaction:${id}`).emit('chatMessage', decryptedMessage);
        }

        res.status(201).json({ success: true, data: decryptedMessage });
    } catch (err) {
        logger.error('Post chat message error: %o', err);
        res.status(500).json({ success: false, message: 'Error en el chat' });
    }
};

// Exported function uploadProof.
export const uploadProof = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'buyer';
        if (!req.file) return res.status(400).json({ success: false, message: 'No se proporcionó archivo' });

        const { url: proofUrl } = await uploadFile(req.file, 'transaction-files');

        const updateResult = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.updateMany({
                where: { id, buyerId: userId },
                data: { buyerProof: proofUrl, status: 'paid' }
            });
        });

        if (updateResult.count === 0) {
            return res.status(400).json({ success: false, message: 'No se pudo actualizar la transacción' });
        }

        await prisma.attachment.create({
            data: {
                type: 'proof',
                url: proofUrl,
                uploaderId: userId,
                transactionId: id,
                mimeType: req.file.mimetype,
                filename: req.file.originalname
            }
        });

        const updated = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.findUnique({
                where: { id },
                include: {
                    product: true,
                    buyer: true,
                    seller: true,
                    attachments: true,
                    chatMessages: { include: { sender: true } }
                }
            });
        });

        const attachments = Array.isArray(updated?.attachments) ? updated.attachments : [];
        const chatMessages = Array.isArray(updated?.chatMessages) ? updated.chatMessages : [];

        const payload = updated ? {
            ...decryptTransactionLocation(updated),
            buyerProof: prefixUrl(updated.buyerProof),
            attachments: attachments.map(a => ({ ...a, url: prefixUrl(a.url) })),
            chatMessages: chatMessages.map(m => ({
                ...m,
                text: typeof m.text === 'string' ? decryptText(m.text) : m.text,
                attachment: prefixUrl(m.attachment),
                sender: m.sender ? { ...m.sender, image: prefixUrl(m.sender.image) } : null
            }))
        } : null;

        const io = getSocketServer();
        if (io && payload) {
            // emit to transaction room (chat listeners) and to buyer/seller user rooms
            io.to(`transaction:${id}`).emit('transactionUpdated', payload);
            if (payload.buyerId) io.to(`user:${payload.buyerId}`).emit('transactionUpdated', payload);
            if (payload.sellerId) io.to(`user:${payload.sellerId}`).emit('transactionUpdated', payload);
        }

        res.json({ success: true, data: payload });
    } catch (err) {
        logger.error('Upload proof error: %o', err);
        res.status(500).json({ success: false, message: 'Error al subir comprobante' });
    }
};

export const updateDeliveryLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'buyer';
        const { buyerDeliveryAddress, buyerDeliveryLat, buyerDeliveryLng } = req.body;

        if (!buyerDeliveryAddress || !buyerDeliveryLat || !buyerDeliveryLng) {
            return res.status(400).json({ success: false, message: 'Ubicación incompleta' });
        }

        const tx = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.findUnique({ where: { id } });
        });
        if (!tx) return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
        if (tx.buyerId !== userId) return res.status(403).json({ success: false, message: 'No autorizado' });
        if (tx.status !== 'paid') return res.status(400).json({ success: false, message: 'La ubicación solo se puede enviar cuando el pago está confirmado' });

        const updated = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.update({
                where: { id },
                data: {
                    buyerDeliveryAddress: encryptText(buyerDeliveryAddress),
                    buyerDeliveryLat: encryptText(buyerDeliveryLat),
                    buyerDeliveryLng: encryptText(buyerDeliveryLng),
                }
            });
        });

        const io = getSocketServer();
        if (io && updated) {
            const payload = decryptTransactionLocation(updated);
            io.to(`transaction:${id}`).emit('transactionUpdated', payload);
            if (payload.buyerId) io.to(`user:${payload.buyerId}`).emit('transactionUpdated', payload);
            if (payload.sellerId) io.to(`user:${payload.sellerId}`).emit('transactionUpdated', payload);
        }
        res.json({ success: true, data: decryptTransactionLocation(updated) });
    } catch (err) {
        logger.error('Delivery location update error: %o', err);
        res.status(500).json({ success: false, message: 'Error al enviar la ubicación' });
    }
};

export const sendLot = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'seller';

        const tx = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.findUnique({ where: { id } });
        });
        if (!tx) return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
        if (tx.sellerId !== userId) return res.status(403).json({ success: false, message: 'No autorizado' });
        if (tx.status !== 'paid') return res.status(400).json({ success: false, message: 'Solo se puede enviar un lote desde el estado PAGADO' });
        if (!tx.buyerDeliveryAddress || !tx.buyerDeliveryLat || !tx.buyerDeliveryLng) {
            return res.status(400).json({ success: false, message: 'El comprador debe compartir la ubicación antes de enviar el lote' });
        }

        const token = generateDeliveryToken();
        const tokenHash = hashToken(token);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const updateResult = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.updateMany({
                where: { id, sellerId: userId, status: 'paid' },
                data: {
                    status: 'in_transit',
                    deliveryToken: tokenHash,
                    deliveryTokenEncrypted: encryptText(token),
                    deliveryTokenExpiresAt: expiresAt,
                }
            });
        });

        if (updateResult.count === 0) {
            return res.status(400).json({ success: false, message: 'No se pudo cambiar la transacción a EN TRÁNSITO' });
        }

        const updated = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.findUnique({
                where: { id },
                include: {
                    product: true,
                    buyer: true,
                    seller: true,
                    attachments: true,
                    chatMessages: { include: { sender: true } }
                }
            });
        });

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Transacción no encontrada después de enviar lote' });
        }

        const attachments = Array.isArray(updated.attachments) ? updated.attachments : [];
        const chatMessages = Array.isArray(updated.chatMessages) ? updated.chatMessages : [];

        const payload = {
            ...decryptTransactionLocation(updated),
            buyerProof: prefixUrl(updated.buyerProof),
            attachments: attachments.map(a => ({ ...a, url: prefixUrl(a.url) })),
            chatMessages: chatMessages.map(m => ({
                ...m,
                text: typeof m.text === 'string' ? decryptText(m.text) : m.text,
                attachment: prefixUrl(m.attachment),
                sender: m.sender ? { ...m.sender, image: prefixUrl(m.sender.image) } : null
            }))
        };
        const io = getSocketServer();
        if (io) {
            io.to(`transaction:${id}`).emit('transactionUpdated', payload);
            if (payload.buyerId) {
                io.to(`user:${payload.buyerId}`).emit('transactionUpdated', {
                    ...payload,
                    deliveryToken: token,
                });
            }
            if (payload.sellerId) io.to(`user:${payload.sellerId}`).emit('transactionUpdated', payload);
        }
        res.json({ success: true, data: payload });
    } catch (err) {
        logger.error('Send lot error: %o', err);
        const message = process.env.NODE_ENV === 'development'
            ? err instanceof Error ? err.message : String(err)
            : 'Error al enviar lote';
        res.status(500).json({ success: false, message });
    }
};

export const verifyDeliveryToken = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'seller';
        const { token } = req.body;

        if (!token) return res.status(400).json({ success: false, message: 'Token requerido' });

        const tx = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.findUnique({ where: { id } }) as any;
        });
        if (!tx) return res.status(404).json({ success: false, message: 'Transacción no encontrada' });
        if (tx.sellerId !== userId) return res.status(403).json({ success: false, message: 'No autorizado' });
        if (tx.status !== 'in_transit') return res.status(400).json({ success: false, message: 'Solo se puede verificar el token cuando la transacción está en tránsito' });
        if (!tx.deliveryToken || !tx.deliveryTokenExpiresAt || new Date(tx.deliveryTokenExpiresAt) < new Date()) {
            return res.status(400).json({ success: false, message: 'Token de entrega no válido o expirado' });
        }
        if (!verifyTokenHash(token, tx.deliveryToken)) {
            return res.status(400).json({ success: false, message: 'Token incorrecto' });
        }

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const final = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.update({
                where: { id },
                data: {
                    status: 'completed',
                    locationExpiresAt: expiresAt,
                    deliveryToken: null,
                    deliveryTokenEncrypted: null,
                    deliveryTokenExpiresAt: null,
                },
                include: {
                    product: true,
                    buyer: true,
                    seller: true,
                    attachments: true,
                    chatMessages: { include: { sender: true } }
                }
            });
        });

        const payload = final ? {
            ...decryptTransactionLocation(final),
            buyerProof: prefixUrl(final.buyerProof),
            attachments: (final.attachments || []).map(a => ({ ...a, url: prefixUrl(a.url) })),
            chatMessages: (final.chatMessages || []).map(m => ({
                ...m,
                text: typeof m.text === 'string' ? decryptText(m.text) : m.text,
                attachment: prefixUrl(m.attachment),
                sender: m.sender ? { ...m.sender, image: prefixUrl(m.sender.image) } : null
            }))
        } : null;

        const io = getSocketServer();
        if (io && payload) {
            io.to(`transaction:${req.params.id}`).emit('transactionUpdated', payload);
            if (payload.buyerId) io.to(`user:${payload.buyerId}`).emit('transactionUpdated', payload);
            if (payload.sellerId) io.to(`user:${payload.sellerId}`).emit('transactionUpdated', payload);
        }

        res.json({ success: true, data: payload });
    } catch (err) {
        logger.error('Verify delivery token error: %o', err);
        res.status(500).json({ success: false, message: 'Error al verificar el token' });
    }
};

// Exported function adminListTransactions.
export const adminListTransactions = async (req: Request, res: Response) => {
    try {
        const txs = await runDbAsAdmin(async (tx) => {
            return tx.transaction.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    buyer: {
                        include: {
                            sellerApplications: { include: { attachments: true } }
                        }
                    },
                    seller: {
                        include: {
                            sellerApplications: { include: { attachments: true } }
                        }
                    },
                    product: true,
                    attachments: true,
                    chatMessages: { include: { sender: true } },
                    disputes: {
                        include: {
                            attachments: true,
                            initiator: true,
                        }
                    }
                }
            });
        });

        const processed = txs.map(tx => ({
            ...decryptTransactionLocation(tx),
            buyerProof: prefixUrl(tx.buyerProof),
            attachments: tx.attachments.map(a => ({ ...a, url: prefixUrl(a.url) })),
            chatMessages: tx.chatMessages.map(m => ({
                ...m,
                text: typeof m.text === 'string' ? decryptText(m.text) : m.text,
                attachment: prefixUrl(m.attachment),
                sender: m.sender ? { ...m.sender, image: prefixUrl(m.sender.image) } : null
            })),
            disputes: tx.disputes?.map(dispute => ({
                ...dispute,
                attachments: dispute.attachments?.map(att => ({ ...att, url: prefixUrl(att.url) })) || [],
                initiator: dispute.initiator ? { ...dispute.initiator } : null,
            })) || [],
            buyer: {
                ...tx.buyer,
                sellerApplications: tx.buyer.sellerApplications?.map(app => ({
                    ...decryptSellerApplication(app),
                    attachments: app.attachments?.map(att => ({ ...att, url: prefixUrl(att.url) })) || []
                })) || []
            },
            seller: {
                ...tx.seller,
                sellerApplications: tx.seller.sellerApplications?.map(app => ({
                    ...decryptSellerApplication(app),
                    attachments: app.attachments?.map(att => ({ ...att, url: prefixUrl(att.url) })) || []
                })) || []
            }
        }));

        res.json({ success: true, data: processed });
    } catch (err: any) {
        logger.error('Admin list transactions error: %o', err);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Exported function completeTransaction.
export const completeTransaction = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role || 'buyer';
        const updateResult = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.updateMany({
                where: {
                    id: req.params.id,
                    buyerId: userId,
                    status: 'in_transit'
                },
                data: { status: 'completed' }
            });
        });

        if (updateResult.count === 0) return res.status(400).json({ success: false, message: 'No se pudo completar' });
        const updated = await runDbAsUser(userId, userRole, async (tx) => {
            return tx.transaction.findUnique({ where: { id: req.params.id } });
        });
        res.json({ success: true, data: decryptTransactionLocation(updated) });
    } catch (err) {
        logger.error('Complete transaction error: %o', err);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};
// Exported function adminResolveTransaction.
export const adminResolveTransaction = async (req: Request, res: Response) => {
    try {
        const updated = await runDbAsAdmin(async (tx) => {
            return tx.transaction.update({
                where: { id: req.params.id },
                data: { status: req.body.status, adminNotes: req.body.notes ? encryptText(req.body.notes) : undefined }
            });
        });
        res.json({ success: true, data: decryptTransactionLocation(updated) });
    } catch (err) {
        logger.error('Admin resolve transaction error: %o', err);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};
// File: src/controllers/notification.controller.ts
// Module responsible for backend functionality.

import { Request, Response } from 'express';
import { Expo, ExpoPushMessage, ExpoPushToken } from 'expo-server-sdk';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '@/middlewares/auth.middleware.js';
import logger from '@/logger/index.js';

const prisma = new PrismaClient();
const expo = new Expo();

interface NotificationSettings {
    pushEnabled: boolean;
    emailEnabled: boolean;
}

// Store push tokens for users
export const registerPushToken = async (req: AuthRequest, res: Response) => {
    try {
        const { token, platform } = req.body;
        const userId = req.user?.id;

        if (!userId || !token) {
            return res.status(400).json({ success: false, message: 'Usuario y token requeridos' });
        }

        // Check if token is already registered
        const existingToken = await prisma.pushToken.findFirst({
            where: { token, userId }
        });

        if (existingToken) {
            // Update platform if changed
            if (existingToken.platform !== platform) {
                await prisma.pushToken.update({
                    where: { id: existingToken.id },
                    data: { platform }
                });
            }
        } else {
            // Create new token
            await prisma.pushToken.create({
                data: {
                    token,
                    platform,
                    userId
                }
            });
        }

        res.json({ success: true, message: 'Token registrado exitosamente' });
    } catch (error: any) {
        logger.error('Error registering push token:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Exported function unregisterPushToken.
export const unregisterPushToken = async (req: AuthRequest, res: Response) => {
    try {
        const { token } = req.body;
        const userId = req.user?.id;

        if (!userId || !token) {
            return res.status(400).json({ success: false, message: 'Usuario y token requeridos' });
        }

        await prisma.pushToken.deleteMany({
            where: { token, userId }
        });

        res.json({ success: true, message: 'Token eliminado exitosamente' });
    } catch (error: any) {
        logger.error('Error unregistering push token:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Send notification to specific user
export const sendNotification = async (req: Request, res: Response) => {
    try {
        const { title, body, data, userId } = req.body;

        if (!title || !body || !userId) {
            return res.status(400).json({ success: false, message: 'Título, cuerpo y usuario requeridos' });
        }

        // Get user's push tokens
        const pushTokens = await prisma.pushToken.findMany({
            where: { userId }
        });

        if (pushTokens.length === 0) {
            return res.json({ success: true, message: 'Usuario no tiene tokens registrados' });
        }

        // Get user notification settings
        const settings = await getUserNotificationSettings(userId.toString());
        if (!settings.pushEnabled) {
            return res.json({ success: true, message: 'Notificaciones push deshabilitadas para este usuario' });
        }

        // Create notification record
        const notification = await prisma.notification.create({
            data: {
                title,
                body,
                data: data || {},
                userId: userId.toString(),
                type: 'push'
            }
        });

        // Send push notifications
        const messages: ExpoPushMessage[] = [];
        for (const token of pushTokens) {
            if (!Expo.isExpoPushToken(token.token)) {
                logger.error(`Push token ${token.token} is not a valid Expo push token`);
                continue;
            }

            messages.push({
                to: token.token as ExpoPushToken,
                sound: 'default',
                title,
                body,
                data: {
                    ...data,
                    notificationId: notification.id
                },
            });
        }

        // Send notifications in chunks
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = await Promise.all(
            chunks.map(chunk => expo.sendPushNotificationsAsync(chunk))
        );

        // Log any errors
        tickets.forEach(ticketChunk => {
            ticketChunk.forEach(ticket => {
                if (ticket.status === 'error') {
                    logger.error('Push notification error:', ticket.message);
                }
            });
        });

        res.json({ success: true, message: 'Notificación enviada', notificationId: notification.id });
    } catch (error: any) {
        logger.error('Error sending notification:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Send notification to multiple users
export const sendNotificationToUsers = async (req: Request, res: Response) => {
    try {
        const { title, body, data, userIds } = req.body;

        if (!title || !body || !userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ success: false, message: 'Título, cuerpo y lista de usuarios requeridos' });
        }

        const results = [];
        for (const userId of userIds) {
            try {
                const result = await sendNotificationToUser(title, body, data, userId);
                results.push({ userId, success: true, ...result });
            } catch (error) {
                results.push({ userId, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
            }
        }

        res.json({ success: true, results });
    } catch (error: any) {
        logger.error('Error sending notifications:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Helper function to send notification to single user
const sendNotificationToUser = async (title: string, body: string, data: any, userId: string) => {
    // Get user's push tokens
    const pushTokens = await prisma.pushToken.findMany({
        where: { userId: userId.toString() }
    });

    if (pushTokens.length === 0) {
        throw new Error('Usuario no tiene tokens registrados');
    }

    // Get user notification settings
    const settings = await getUserNotificationSettings(userId.toString());
    if (!settings.pushEnabled) {
        throw new Error('Notificaciones push deshabilitadas');
    }

    // Create notification record
    const notification = await prisma.notification.create({
        data: {
            title,
            body,
            data: data || {},
            userId: userId.toString(),
            type: 'push'
        }
    });

    // Send push notifications
    const messages: ExpoPushMessage[] = [];
    for (const token of pushTokens) {
        if (!Expo.isExpoPushToken(token.token)) {
            logger.error(`Push token ${token.token} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: token.token as ExpoPushToken,
            sound: 'default',
            title,
            body,
            data: {
                ...data,
                notificationId: notification.id
            },
        });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = await Promise.all(
        chunks.map(chunk => expo.sendPushNotificationsAsync(chunk))
    );

    return { notificationId: notification.id, tickets };
};

// Get notification history for user
export const getNotificationHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });

        const total = await prisma.notification.count({
            where: { userId: userId.toString() }
        });

        res.json({
            success: true,
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        logger.error('Error fetching notification history:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Mark notification as read
export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user?.id;

        const notification = await prisma.notification.findFirst({
            where: { id: notificationId, userId }
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
        }

        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });

        res.json({ success: true, message: 'Notificación marcada como leída' });
    } catch (error: any) {
        logger.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });

        res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error: any) {
        logger.error('Error marking all notifications as read:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Get notification settings
export const getNotificationSettings = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const settings = await getUserNotificationSettings(userId);

        res.json({ success: true, settings });
    } catch (error: any) {
        logger.error('Error fetching notification settings:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Update notification settings
export const updateNotificationSettings = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { pushEnabled, emailEnabled } = req.body;

        const settings = await prisma.notificationSettings.upsert({
            where: { userId },
            update: { pushEnabled, emailEnabled },
            create: { userId, pushEnabled, emailEnabled }
        });

        res.json({ success: true, settings });
    } catch (error: any) {
        logger.error('Error updating notification settings:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
};

// Helper function to get notification settings
const getUserNotificationSettings = async (userId: string): Promise<NotificationSettings> => {
    const settings = await prisma.notificationSettings.findUnique({
        where: { userId }
    });

    return settings || { pushEnabled: true, emailEnabled: false };
};
// File: src/routes/notifications.routes.ts
// Module responsible for backend functionality.

import { Router } from 'express';
import {
    registerPushToken,
    unregisterPushToken,
    sendNotification,
    sendNotificationToUsers,
    getNotificationHistory,
    markAsRead,
    markAllAsRead,
    getNotificationSettings,
    updateNotificationSettings
} from '@/controllers/notification.controller.js';
import { isAuth } from '@/middlewares/auth.middleware.js';

const router = Router();

// All notification routes require authentication
router.use(isAuth);

// Push token management
router.post('/register-token', registerPushToken);
router.post('/unregister-token', unregisterPushToken);

// Send notifications (admin/internal use)
router.post('/send', sendNotification);
router.post('/send-multiple', sendNotificationToUsers);

// Notification history
router.get('/history/:userId', getNotificationHistory);

// Mark as read
router.patch('/:id/read', markAsRead);
router.patch('/:userId/read-all', markAllAsRead);

// Notification settings
router.get('/settings/:userId', getNotificationSettings);
router.patch('/settings/:userId', updateNotificationSettings);

// Default export for module usage.
export default router;
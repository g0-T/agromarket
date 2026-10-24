// File: frontend/src/services/notification.service.ts
// Frontend service module for API or client operations.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from '@/services/api.service';
import logger from '@/utils/logger';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

interface PushTokenData {
    token: string;
    platform: 'ios' | 'android';
}

interface NotificationData {
    title: string;
    body: string;
    data?: any;
    userId?: string;
}

class NotificationService {
    private pushToken: string | null = null;

    async registerForPushNotificationsAsync(): Promise<string | null> {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                logger.warn('Failed to get push token for push notification!');
                return null;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            this.pushToken = token;

            await this.sendPushTokenToBackend(token);

            return token;
        } catch (error) {
            logger.error(error, { context: 'registerForPushNotificationsAsync' });
            return null;
        }
    }

    private async sendPushTokenToBackend(token: string): Promise<void> {
        try {
            const platform = Platform.OS as 'ios' | 'android';
            await api.post('/notifications/register-token', {
                token,
                platform,
            });
        } catch (error) {
            logger.error(error, { context: 'sendPushTokenToBackend' });
        }
    }

    async unregisterPushToken(): Promise<void> {
        if (!this.pushToken) return;

        try {
            await api.post('/notifications/unregister-token', {
                token: this.pushToken,
            });
            this.pushToken = null;
        } catch (error) {
            logger.error(error, { context: 'unregisterPushToken' });
        }
    }

    // Send notification to specific user
    async sendNotificationToUser(notificationData: NotificationData): Promise<void> {
        try {
            await api.post('/notifications/send', notificationData);
        } catch (error) {
            logger.error(error, { context: 'sendNotificationToUser' });
        }
    }

    // Send notification to multiple users
    async sendNotificationToUsers(notificationData: NotificationData, userIds: number[]): Promise<void> {
        try {
            await api.post('/notifications/send-multiple', {
                ...notificationData,
                userIds,
            });
        } catch (error) {
            logger.error(error, { context: 'sendNotificationToUsers' });
        }
    }

    // Get notification history for user
    async getNotificationHistory(userId: string): Promise<any[]> {
        try {
            const response = await api.get(`/notifications/history/${userId}`);
            return response.data;
        } catch (error) {
            logger.error(error, { context: 'getNotificationHistory' });
            return [];
        }
    }

    // Mark notification as read
    async markAsRead(notificationId: string): Promise<void> {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
        } catch (error) {
            logger.error(error, { context: 'markAsRead' });
        }
    }

    // Mark all notifications as read
    async markAllAsRead(userId: string): Promise<void> {
        try {
            await api.patch(`/notifications/${userId}/read-all`);
        } catch (error) {
            logger.error(error, { context: 'markAllAsRead' });
        }
    }

    // Get current push token
    getPushToken(): string | null {
        return this.pushToken;
    }

    // Schedule local notification
    async scheduleLocalNotification(title: string, body: string, data?: any): Promise<string> {
        try {
            const id = await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data: data || {},
                    sound: 'default',
                },
                trigger: null, 
            });
            return id;
        } catch (error) {
            logger.error(error, { context: 'scheduleLocalNotification' });
            throw error;
        }
    }

    // Cancel scheduled notification
    async cancelScheduledNotification(notificationId: string): Promise<void> {
        try {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
        } catch (error) {
            logger.error(error, { context: 'cancelScheduledNotification' });
        }
    }

    // Get notification settings
    async getNotificationSettings(userId: string): Promise<any> {
        try {
            const response = await api.get(`/notifications/settings/${userId}`);
            return response.data;
        } catch (error) {
            logger.error(error, { context: 'getNotificationSettings' });
            return { pushEnabled: true, emailEnabled: false };
        }
    }

    // Update notification settings
    async updateNotificationSettings(userId: string, settings: { pushEnabled: boolean; emailEnabled: boolean }): Promise<void> {
        try {
            await api.patch(`/notifications/settings/${userId}`, settings);
        } catch (error) {
            logger.error(error, { context: 'updateNotificationSettings' });
        }
    }
}

const notificationService = new NotificationService();

// Default export for this module.
export default notificationService;
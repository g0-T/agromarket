// File: frontend/src/hooks/use-push-notifications.ts
// Custom hook logic for React state and side effects.

import { useEffect, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import AuthContext from '@/context/AuthContext';
import notificationService from '@/services/notification.service';
import logger from '@/utils/logger';

// Exported constant usePushNotifications.
export const usePushNotifications = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        // Register for push notifications when user logs in
        if (user?.id) {
            registerForPushNotifications();
        }

        // Set up notification listeners
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            logger.info('Notification received', notification);
        });

        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            logger.info('Notification response', data);

            // Handle notification tap - navigate to relevant screen
            if (data?.type === 'message') {
                router.push(`/transactions/${data.transactionId}`);
            } else if (data?.type === 'offer') {
                router.push(`/(lots)/${data.productId}`);
            } else if (data?.type === 'transaction') {
                router.push('/transactions');
            }
        });

        return () => {
            subscription.remove();
            responseSubscription.remove();
        };
    }, [user?.id]);

    const registerForPushNotifications = async () => {
        try {
            const token = await notificationService.registerForPushNotificationsAsync();
            if (token) {
                logger.info('Push token registered', { token });
            }
        } catch (error) {
            logger.error(error, { context: 'registerForPushNotifications' });
        }
    };

    const unregisterPushNotifications = async () => {
        try {
            await notificationService.unregisterPushToken();
            logger.info('Push token unregistered');
        } catch (error) {
            logger.error(error, { context: 'unregisterPushNotifications' });
        }
    };

    return {
        registerForPushNotifications,
        unregisterPushNotifications,
    };
};
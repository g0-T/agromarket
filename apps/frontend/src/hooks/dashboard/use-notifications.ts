// File: frontend/src/hooks/dashboard/use-notifications.ts
// Custom hook logic for React state and side effects.

import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getNotificationsStyles } from '@/styles/screens/dashboard/notifications.styles';
import notificationService from '@/services/notification.service';
import { useAuth } from '@/hooks/use-auth';
import logger from '@/utils/logger';

// Type declaration NotificationItem.
export interface NotificationItem {
    id: string;
    icon: keyof typeof import('@expo/vector-icons').MaterialIcons.glyphMap;
    iconColor: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const getNotificationIcon = (type: string): { icon: keyof typeof import('@expo/vector-icons').MaterialIcons.glyphMap; color: string } => {
    switch (type) {
        case 'new_offer':
            return { icon: 'local-offer', color: '#3b82f6' };
        case 'new_message':
            return { icon: 'chat-bubble', color: '#8b5cf6' };
        case 'transaction_completed':
            return { icon: 'check-circle', color: '#22c55e' };
        case 'transaction_cancelled':
            return { icon: 'cancel', color: '#ef4444' };
        default:
            return { icon: 'notifications', color: '#6b7280' };
    }
};

const formatTime = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return notificationDate.toLocaleDateString();
};

// Exported constant useNotifications.
export const useNotifications = () => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    const { colors, styles } = useTheme(getNotificationsStyles);
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchNotifications = async () => {
            try {
                const data = await notificationService.getNotificationHistory(user.id);
                const formattedNotifications: NotificationItem[] = data.map(notification => {
                    const { icon, color } = getNotificationIcon(notification.type);
                    return {
                        id: notification.id,
                        icon,
                        iconColor: color,
                        title: notification.title,
                        message: notification.message,
                        time: formatTime(notification.createdAt),
                        read: notification.read,
                    };
                });
                setNotifications(formattedNotifications);
            } catch (error) {
                logger.error(error, { context: 'fetchNotifications' });
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user?.id]);

    const markAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            ));
        } catch (error) {
            logger.error(error, { context: 'markAsRead' });
        }
    };

    const markAllAsRead = async () => {
        if (!user?.id) return;
        try {
            await notificationService.markAllAsRead(user.id);
            setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        } catch (error) {
            logger.error(error, { context: 'markAllAsRead' });
        }
    };

    const unreadCount = notifications.filter(notification => !notification.read).length;

    return {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead,
        isDesktop,
        colors,
        styles,
    };
};
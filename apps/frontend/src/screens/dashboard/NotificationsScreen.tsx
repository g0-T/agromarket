// File: frontend/src/screens/dashboard/NotificationsScreen.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotifications } from '@/hooks/dashboard/use-notifications';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { NotificationsHeader } from '@/components/dashboard/NotificationsHeader';
import { NotificationCard } from '@/components/dashboard/NotificationCard';

// Default React component export.
export default function NotificationsScreen() {
    const {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead,
        isDesktop,
        colors,
        styles,
    } = useNotifications();

    if (loading) {
        return (
            <DashboardShell isDesktop={isDesktop} styles={styles}>
                <NotificationsHeader
                    unreadCount={0}
                    onMarkAllAsRead={() => { }}
                    colors={colors}
                    styles={styles}
                />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>Cargando notificaciones...</Text>
                </View>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell isDesktop={isDesktop} styles={styles}>
            <NotificationsHeader
                unreadCount={unreadCount}
                onMarkAllAsRead={markAllAsRead}
                colors={colors}
                styles={styles}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIcon}>
                            <MaterialIcons name="notifications-none" size={32} color={colors.brand} />
                        </View>
                        <Text style={styles.emptyTitle}>No hay notificaciones</Text>
                        <Text style={styles.emptySubtitle}>
                            Cuando tengas actividad en tu cuenta, las verás aquí.
                        </Text>
                    </View>
                ) : (
                    notifications.map(notification => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onPress={() => markAsRead(notification.id)}
                            colors={colors}
                            styles={styles}
                        />
                    ))
                )}
            </ScrollView>
        </DashboardShell>
    );
}

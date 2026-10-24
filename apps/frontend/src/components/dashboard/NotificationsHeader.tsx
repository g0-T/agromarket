
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NotificationsHeaderProps {
    unreadCount: number;
    onMarkAllAsRead: () => void;
    colors: any;
    styles: any;
}

export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
    unreadCount,
    onMarkAllAsRead,
    colors,
    styles,
}) => {
    return (
        <View style={styles.header}>
            <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Notificaciones</Text>
                <Text style={styles.headerSubtitle}>
                    {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
                </Text>
            </View>
            {unreadCount > 0 && (
                <TouchableOpacity style={styles.markAllButton} onPress={onMarkAllAsRead}>
                    <Text style={styles.markAllButtonText}>Marcar todas como leídas</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

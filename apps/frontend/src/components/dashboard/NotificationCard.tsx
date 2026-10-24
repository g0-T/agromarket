
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NotificationItem } from '@/hooks/dashboard/use-notifications';

interface NotificationCardProps {
    notification: NotificationItem;
    onPress: () => void;
    colors: any;
    styles: any;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    onPress,
    colors,
    styles,
}) => {
    return (
        <TouchableOpacity
            style={styles.notificationCard}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.notificationRow}>
                <View
                    style={[
                        styles.notificationIconWrap,
                        { backgroundColor: notification.iconColor + '20' },
                    ]}
                >
                    <MaterialIcons
                        name={notification.icon as any}
                        size={20}
                        color={notification.iconColor}
                    />
                </View>
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
                {!notification.read && <View style={styles.notificationUnread} />}
            </View>
        </TouchableOpacity>
    );
};


import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ActivityItem {
    id: string;
    icon: string;
    iconColor: string;
    title: string;
    subtitle: string;
    time: string;
    highlight?: boolean;
    read?: boolean;
}

interface ActivityListProps {
    activities: ActivityItem[];
    colors: any;
    styles: any;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, colors, styles }) => (
    <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        <FlatList
            data={activities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={[styles.activityItem, item.highlight && styles.activityItemHighlight]}>
                    <MaterialIcons name={item.icon as any} size={24} color={item.iconColor} />
                    <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{item.title}</Text>
                        <Text style={styles.activitySubtitle}>{item.subtitle}</Text>
                        <Text style={styles.activityTime}>{item.time}</Text>
                    </View>
                    {!item.read && <View style={styles.unreadDot} />}
                </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay actividad reciente</Text>}
        />
    </View>
);

export default ActivityList;

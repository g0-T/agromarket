// File: frontend/src/components/admin/ApplicationList.tsx
// List component for application list.

import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SellerApplication } from '@/hooks/admin/use-admin-dashboard-data';

// Type declaration ApplicationListProps.
interface ApplicationListProps {
    applications: SellerApplication[];
    onSelectApplication: (app: SellerApplication) => void;
    colors: any;
    styles: any;
}

// Component for application list.
const ApplicationList: React.FC<ApplicationListProps> = ({ applications, onSelectApplication, colors, styles }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'approved': return '#22c55e';
            case 'rejected': return '#ef4444';
            default: return colors.mutedText;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'approved': return 'Aprobado';
            case 'rejected': return 'Rechazado';
            default: return status;
        }
    };

    const renderItem = ({ item }: { item: SellerApplication }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => onSelectApplication(item)}
            activeOpacity={0.7}
        >
            <View style={styles.listItemContent}>
                <View style={styles.listItemHeader}>
                    <Text style={styles.listItemTitle}>{item.user.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusBadgeText}>{getStatusText(item.status)}</Text>
                    </View>
                </View>
                <Text style={styles.listItemSubtitle}>{item.user.email}</Text>
                {item.farmLocationAddress || item.farmLocationLat !== undefined || item.farmLocationLng !== undefined ? (
                    <View style={styles.locationRow}>
                        <Text style={styles.locationLabel}>Finca</Text>
                        <Text style={styles.applicationLocationText} numberOfLines={1}>
                            {item.farmLocationAddress ? item.farmLocationAddress : `Lat ${item.farmLocationLat ?? '—'}, Lng ${item.farmLocationLng ?? '—'}`}
                        </Text>
                    </View>
                ) : null}
                <Text style={styles.listItemSubtitle}>
                    Cédula: {item.attachments?.some(att => att.type === 'cedula') ? 'Cargada' : 'No cargada'} · Hierro: {item.attachments?.some(att => att.type === 'hierro') ? 'Cargado' : 'No cargado'}
                </Text>
                <Text style={styles.listItemDate}>
                    Enviado: {new Date(item.submittedAt).toLocaleDateString()}
                </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.mutedText} />
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={applications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
};

// Default export for this module.
export default ApplicationList;

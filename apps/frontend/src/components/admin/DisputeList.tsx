// File: frontend/src/components/admin/DisputeList.tsx
// List component for dispute list.

import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Dispute } from '@/hooks/admin/use-admin-dashboard-data';

// Type declaration DisputeListProps.
interface DisputeListProps {
    disputes: Dispute[];
    onSelectDispute: (dispute: Dispute) => void;
    colors: any;
    styles: any;
}

// Component for dispute list.
const DisputeList: React.FC<DisputeListProps> = ({ disputes, onSelectDispute, colors, styles }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return colors.warning;
            case 'resolved': return colors.success;
            case 'closed': return colors.error;
            default: return colors.textSecondary;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'open': return 'Abierta';
            case 'resolved': return 'Resuelta';
            case 'closed': return 'Cerrada';
            default: return status;
        }
    };

    const renderDispute = ({ item }: { item: Dispute }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => onSelectDispute(item)}
        >
            <View style={styles.listItemHeader}>
                <View style={styles.listItemTitleContainer}>
                    <Text style={styles.listItemTitle}>
                        Disputa #{item.id.slice(0, 8)}
                    </Text>
                    <Text style={[styles.listItemSubtitle, { color: getStatusColor(item.status) }]}>
                        {getStatusText(item.status)}
                    </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </View>

            <View style={styles.listItemDetails}>
                <Text style={styles.listItemDetail}>
                    Producto: {item.transaction.product.title}
                </Text>
                <Text style={styles.listItemDetail}>
                    Iniciada por: {item.initiator.name || item.initiator.email}
                </Text>
                <Text style={styles.listItemDetail}>
                    Monto: ${item.transaction.amount} {item.transaction.currency}
                </Text>
                <Text style={styles.listItemDetail}>
                    Fecha: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>

            <Text style={styles.listItemReason} numberOfLines={2}>
                {item.reason}
            </Text>
        </TouchableOpacity>
    );

    if (disputes.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialIcons name="report-problem" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No hay disputas para mostrar</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={disputes}
            keyExtractor={(item) => item.id}
            renderItem={renderDispute}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
        />
    );
};

// Default export for this module.
export default DisputeList;

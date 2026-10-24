// File: frontend/src/components/admin/TransactionList.tsx
// List component for transaction list.

import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/currency';

// Type declaration Transaction.
type Transaction = {
    id: string;
    product: any;
    buyerId: string;
    sellerId: string;
    buyerName?: string;
    sellerName?: string;
    buyer?: {
        id: string;
        name?: string;
        email?: string;
        phone?: string;
        image?: string;
        role?: string;
        sellerApplications?: { attachments?: { id: string; type: string; url: string; filename?: string }[] }[];
    };
    seller?: {
        id: string;
        name?: string;
        email?: string;
        phone?: string;
        image?: string;
        role?: string;
        sellerApplications?: { attachments?: { id: string; type: string; url: string; filename?: string }[] }[];
    };
    amount: number;
    currency: string;
    status: string;
    buyerProof?: string;
    buyerDeliveryAddress?: string;
    buyerDeliveryLat?: string;
    buyerDeliveryLng?: string;
    attachments?: { id: string; type: string; url: string }[];
    chatMessages: any[];
    createdAt: string;
};

interface TransactionListProps {
    transactions: Transaction[];
    onSelectTransaction: (tx: Transaction) => void;
    colors: any;
    styles: any;
}

// Component for transaction list.
const TransactionList: React.FC<TransactionListProps> = ({ transactions, onSelectTransaction, colors, styles }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'paid':
            case 'approved':
            case 'completed': return '#22c55e';
            case 'disputed':
            case 'rejected':
            case 'blocked_from_applying': return '#ef4444';
            case 'cancelled': return '#6b7280';
            default: return colors.mutedText;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'paid': return 'Pagado';
            case 'approved': return 'Aprobado';
            case 'completed': return 'Completado';
            case 'disputed': return 'Disputa';
            case 'rejected': return 'Rechazado';
            case 'blocked_from_applying': return 'Bloqueado';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    const getRoleText = (role: string) => {
        switch (role?.toLowerCase()) {
            case 'seller': return 'Vendedor/Comprador';
            case 'buyer': return 'Comprador';
            default: return role;
        }
    };

    const renderItem = ({ item }: { item: Transaction }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => onSelectTransaction(item)}
            activeOpacity={0.7}
        >
            <View style={styles.listItemContent}>
                <View style={styles.listItemHeader}>
                    <Text style={styles.listItemTitle}>{item.product?.title || '—'}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusBadgeText}>{getStatusText(item.status)}</Text>
                    </View>
                </View>
                <Text style={styles.listItemSubtitle}>
                    {item.buyerName} ({getRoleText(item.buyer?.role || 'buyer')}) → {item.sellerName} ({getRoleText(item.seller?.role || 'seller')})
                </Text>
                {item.buyerDeliveryAddress ? (
                    <Text style={[styles.listItemSubtitle, { marginTop: 4 }]} numberOfLines={1}>
                        Entrega: {item.buyerDeliveryAddress}
                    </Text>
                ) : null}
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionAmount}>
                        {formatCurrency(item.amount, item.currency)}
                    </Text>
                    <Text style={styles.listItemDate}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.mutedText} />
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
};

// Default export for this module.
export default TransactionList;

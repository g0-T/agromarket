// File: frontend/src/components/transactions/MobileTransactionsView.tsx
// Component for mobile transactions view.

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MobilePurchaseCard, MobileSaleCard } from '@/components/transactions/TransactionCards';
import { StatsRow } from '@/components/transactions/StatsRow';
import { EmptyState } from '@/components/transactions/EmptyState';
import { Transaction } from '@/utils/transaction-helpers';

// Type declaration MobileTransactionsViewProps.
interface MobileTransactionsViewProps {
    activeTab: 'sales' | 'purchases';
    setActiveTab: (tab: 'sales' | 'purchases') => void;
    isSeller: boolean;
    mySales: Transaction[];
    myPurchases: Transaction[];
    activePurchases: Transaction[];
    handleProofUpload: (txId: string, file: any) => Promise<void>;
    onConfirmReception: (txId: string) => Promise<void>;
    onSendLot: (txId: string) => Promise<void>;
    onVerifyDeliveryToken: (txId: string, token: string) => Promise<void>;
    sendBuyerFarmLocation: (txId: string) => Promise<void>;
    onOpenDispute: (transaction: Transaction) => void;
    styles: any;
    colors: any;
}

// Exported constant MobileTransactionsView.
export const MobileTransactionsView: React.FC<MobileTransactionsViewProps> = ({
    activeTab,
    setActiveTab,
    isSeller,
    mySales,
    myPurchases,
    activePurchases,
    handleProofUpload,
    onConfirmReception,
    onSendLot,
    onVerifyDeliveryToken,
    sendBuyerFarmLocation,
    onOpenDispute,
    styles,
    colors,
}) => (
    <>
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Transacciones</Text>
                <Text style={styles.headerSubtitle}>
                    {isSeller ? 'Ventas y compras' : 'Mis compras'}
                </Text>
            </View>
            <TouchableOpacity>
                <MaterialIcons name="filter-list" size={24} color={colors.brand} />
            </TouchableOpacity>
        </View>

        {isSeller && (
            <View style={styles.tabsWrapper}>
                {(['sales', 'purchases'] as const).map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.tab, activeTab === t && styles.tabActive]}
                        onPress={() => setActiveTab(t)}
                        activeOpacity={0.85}
                    >
                        <MaterialIcons name={t === 'sales' ? 'inventory' : 'shopping-cart'} size={15} color={activeTab === t ? '#fff' : colors.mutedText} />
                        <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                            {t === 'sales' ? 'Mis Ventas' : 'Mis Compras'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        )}

        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <StatsRow
                activeTab={activeTab}
                mySales={mySales}
                myPurchases={myPurchases}
                activePurchases={activePurchases}
                styles={styles}
            />

            <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>
                    {activeTab === 'sales' ? 'Mis Ventas' : 'Rastreo de Compras'}
                </Text>
            </View>

            {activeTab === 'sales' ? (
                mySales.length > 0 ? (
                    mySales.map(sale => sale.product ? (
                        <MobileSaleCard
                            key={sale.id}
                            sale={sale}
                            styles={styles}
                            colors={colors}
                            onVerifyDeliveryToken={onVerifyDeliveryToken}
                            onSendLot={onSendLot}
                            onOpenDispute={onOpenDispute}
                        />
                    ) : null)
                ) : (
                    <EmptyState activeTab={activeTab} styles={styles} colors={colors} />
                )
            ) : myPurchases.length > 0 ? (
                myPurchases.map(purchase => purchase.product ? (
                    <MobilePurchaseCard
                        key={purchase.id}
                        purchase={purchase}
                        styles={styles}
                        colors={colors}
                        onUploadProof={handleProofUpload}
                        onConfirmReception={onConfirmReception}
                        onSendLot={onSendLot}
                        sendBuyerFarmLocation={sendBuyerFarmLocation}
                        onOpenDispute={onOpenDispute}
                    />
                ) : null)
            ) : (
                <EmptyState activeTab={activeTab} styles={styles} colors={colors} />
            )}
        </ScrollView>
    </>
);

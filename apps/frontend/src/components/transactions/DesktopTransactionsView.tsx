// File: frontend/src/components/transactions/DesktopTransactionsView.tsx
// Component for desktop transactions view.

import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DesktopListRow } from '@/components/transactions/TransactionCards';
import { DesktopDetailPanel } from '@/components/transactions/DesktopDetailPanel';
import { StatsRow } from '@/components/transactions/StatsRow';
import { Transaction } from '@/utils/transaction-helpers';

// Type declaration DesktopTransactionsViewProps.
interface DesktopTransactionsViewProps {
    activeTab: 'sales' | 'purchases';
    setActiveTab: (tab: 'sales' | 'purchases') => void;
    isSeller: boolean;
    mySales: Transaction[];
    myPurchases: Transaction[];
    selectedSaleIdx: number;
    setSelectedSaleIdx: (idx: number) => void;
    selectedPurchaseIdx: number;
    setSelectedPurchaseIdx: (idx: number) => void;
    desktopSubTab: 'detail' | 'chat';
    setDesktopSubTab: (tab: 'detail' | 'chat') => void;
    user: any;
    handleProofUpload: (txId: string, file: any) => Promise<void>;
    sendBuyerFarmLocation: (txtId: string) => Promise<void>;
    onConfirmReception: (txId: string) => Promise<void>;
    onSendLot: (txId: string) => Promise<void>;
    onVerifyDeliveryToken: (txId: string, token: string) => Promise<void>;
    onOpenDispute: (transaction: Transaction) => void;
    styles: any;
    colors: any;
}

// Component for tab_labels.
const TAB_LABELS = {
    sales: 'Mis Ventas',
    purchases: 'Mis Compras',
} as const;

const HEADER_SUBTITLE = (isSeller: boolean) =>
    isSeller ? 'Ventas y compras' : 'Mis compras';

// Exported constant DesktopTransactionsView.
export const DesktopTransactionsView: React.FC<DesktopTransactionsViewProps> = ({
    activeTab,
    setActiveTab,
    isSeller,
    mySales,
    myPurchases,
    selectedSaleIdx,
    setSelectedSaleIdx,
    selectedPurchaseIdx,
    setSelectedPurchaseIdx,
    desktopSubTab,
    setDesktopSubTab,
    user,
    handleProofUpload,
    sendBuyerFarmLocation,
    onVerifyDeliveryToken,
    onConfirmReception,
    onSendLot,
    onOpenDispute,
    styles,
    colors,
}) => {
    const selectedSale = mySales[selectedSaleIdx] || null;
    const selectedPurchase = myPurchases[selectedPurchaseIdx] || null;

    return (
        <View style={styles.desktopRoot}>
            <View style={styles.desktopSidebar}>
                <View style={styles.desktopSidebarHeader}>
                    <Text style={styles.headerTitle}>Actividad</Text>
                    <Text style={styles.headerSubtitle}>{HEADER_SUBTITLE(isSeller)}</Text>
                </View>

                {isSeller && (
                    <View style={styles.desktopSidebarTabs}>
                        {(['sales', 'purchases'] as const).map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.desktopSidebarTab, activeTab === t && styles.desktopSidebarTabActive]}
                                onPress={() => setActiveTab(t)}
                                activeOpacity={0.85}
                            >
                                <MaterialIcons name={t === 'sales' ? 'inventory' : 'shopping-cart'} size={15} color={activeTab === t ? colors.brand : colors.mutedText} />
                                <Text style={[styles.desktopSidebarTabText, activeTab === t && styles.desktopSidebarTabTextActive]}>{TAB_LABELS[t]}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={{ paddingHorizontal: 12, paddingBottom: 4 }}>
                    <StatsRow
                        activeTab={activeTab}
                        mySales={mySales}
                        myPurchases={myPurchases}
                        activePurchases={myPurchases.filter(p => p.status !== 'completed')}
                        styles={styles}
                    />
                </View>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {(activeTab === 'sales' ? mySales : myPurchases).map((item, idx) => (
                        <DesktopListRow
                            key={item.id}
                            title={item.product?.title}
                            subtitle={activeTab === 'sales' ? `Comprador: ${item.buyerName}` : `Vendedor: ${item.sellerName}`}
                            orderId={item.id}
                            status={item.status}
                            imgUri={item.product?.img}
                            isSelected={idx === (activeTab === 'sales' ? selectedSaleIdx : selectedPurchaseIdx)}
                            onPress={() => {
                                if (activeTab === 'sales') setSelectedSaleIdx(idx);
                                else setSelectedPurchaseIdx(idx);
                                setDesktopSubTab('detail');
                            }}
                            styles={styles}
                            colors={colors}
                        />
                    ))}
                </ScrollView>
            </View>
            <DesktopDetailPanel
                activeTab={activeTab}
                selectedSale={selectedSale}
                selectedPurchase={selectedPurchase}
                desktopSubTab={desktopSubTab}
                setDesktopSubTab={setDesktopSubTab}
                user={user}
                handleProofUpload={handleProofUpload}
                sendBuyerFarmLocation={sendBuyerFarmLocation}
                onConfirmReception={onConfirmReception}
                onSendLot={onSendLot}
                onVerifyDeliveryToken={onVerifyDeliveryToken}
                onOpenDispute={onOpenDispute}
                styles={styles}
                colors={colors}
            />
        </View>
    );
};

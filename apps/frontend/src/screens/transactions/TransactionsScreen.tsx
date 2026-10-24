// File: frontend/src/screens/transactions/TransactionsScreen.tsx
// Screen component defining a top-level app view.

import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '@/hooks/use-auth';
import { getStyles } from '@/styles/screens/transactions/transactions.styles';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { useTransactions } from '@/hooks/transactions/use-transactions';
import { DesktopTransactionsView } from '@/components/transactions/DesktopTransactionsView';
import { MobileTransactionsView } from '@/components/transactions/MobileTransactionsView';
import DisputeModal from '@/components/transactions/DisputeModal';
import { LocationPicker } from '@/components/seller/LocationPicker';
import { getBecomeSellerStyles } from '@/styles/screens/auth/become-seller.styles';
import { Transaction } from '@/utils/transaction-helpers';
import logger from '@/utils/logger';

const TransactionsScreen = () => {
    const { isDark, colors, styles } = useTheme(getStyles);
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const {
        isSeller,
        activeTab,
        setActiveTab,
        selectedSaleIdx,
        setSelectedSaleIdx,
        selectedPurchaseIdx,
        setSelectedPurchaseIdx,
        desktopSubTab,
        setDesktopSubTab,
        mySales,
        myPurchases,
        activePurchases,
        handleProofUpload,
        sendBuyerFarmLocation,
        handleConfirmReception,
        handleSendLot,
        verifyDeliveryToken,
        handleCreateDispute,
    } = useTransactions();
    const sellerStyles = getBecomeSellerStyles(colors);
    const [selectedDisputeTransaction, setSelectedDisputeTransaction] = useState<Transaction | null>(null);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [locationTxId, setLocationTxId] = useState<string | null>(null);
    const [locationInitial, setLocationInitial] = useState<{ lat?: number; lng?: number; address?: string } | null>(null);
    const [isDisputeModalVisible, setIsDisputeModalVisible] = useState(false);

    const openDisputeModal = (transaction: Transaction) => {
        setSelectedDisputeTransaction(transaction);
        setIsDisputeModalVisible(true);
    };

    const closeDisputeModal = () => {
        setIsDisputeModalVisible(false);
        setSelectedDisputeTransaction(null);
    };

    const openLocationPicker = (txId: string, initialLocation?: { lat?: number; lng?: number; address?: string }) => {
        setLocationTxId(txId);
        setLocationInitial(initialLocation ?? null);
        setShowLocationPicker(true);
    };

    const openBuyerLocationPicker = async (txId: string) => {
        openLocationPicker(txId);
        return Promise.resolve();
    };

    const closeLocationPicker = () => {
        setShowLocationPicker(false);
        setLocationTxId(null);
        setLocationInitial(null);
    };

    const handleLocationSelect = async (location: { lat: number; lng: number; address?: string }) => {
        if (!locationTxId) return;
        try {
            await sendBuyerFarmLocation(locationTxId, {
                buyerDeliveryAddress: location.address || `${location.lat}, ${location.lng}`,
                buyerDeliveryLat: location.lat.toString(),
                buyerDeliveryLng: location.lng.toString(),
            });
            closeLocationPicker();
        } catch (err) {
            logger.warn('Failed to save buyer location', { error: err });
            Alert.alert('Error', 'No se pudo guardar la ubicación. Intenta nuevamente.');
        }
    };

    const submitDispute = async (reason: string, photos: any[]) => {
        if (!selectedDisputeTransaction) return;
        try {
            await handleCreateDispute(selectedDisputeTransaction.id, reason, photos);
            closeDisputeModal();
        } catch (err) {
            logger.warn('Dispute submission failed', { error: err });
            Alert.alert('Error', 'No se pudo enviar la disputa. Intenta nuevamente.');
        }
    };

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.brand} />
                    <Text style={{ color: colors.textColor, marginTop: 14 }}>Cargando usuario...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (isDesktop) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <DesktopTransactionsView
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isSeller={isSeller}
                    mySales={mySales}
                    myPurchases={myPurchases}
                    selectedSaleIdx={selectedSaleIdx}
                    setSelectedSaleIdx={setSelectedSaleIdx}
                    selectedPurchaseIdx={selectedPurchaseIdx}
                    setSelectedPurchaseIdx={setSelectedPurchaseIdx}
                    desktopSubTab={desktopSubTab}
                    setDesktopSubTab={setDesktopSubTab}
                    user={user}
                    handleProofUpload={handleProofUpload}
                    sendBuyerFarmLocation={openBuyerLocationPicker}
                    onConfirmReception={handleConfirmReception}
                    onSendLot={handleSendLot}
                    onVerifyDeliveryToken={verifyDeliveryToken}
                    onOpenDispute={openDisputeModal}
                    styles={styles}
                    colors={colors}
                />
                <DisputeModal
                    visible={isDisputeModalVisible}
                    transaction={selectedDisputeTransaction}
                    onClose={closeDisputeModal}
                    onSubmit={submitDispute}
                    styles={styles}
                    colors={colors}
                />
                {showLocationPicker && (
                    <LocationPicker
                        initialLocation={locationInitial || undefined}
                        onLocationSelect={handleLocationSelect}
                        onClose={closeLocationPicker}
                        colors={colors}
                        styles={sellerStyles}
                    />
                )}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <MobileTransactionsView
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSeller={isSeller}
                mySales={mySales}
                myPurchases={myPurchases}
                activePurchases={activePurchases}
                handleProofUpload={handleProofUpload}
                sendBuyerFarmLocation={openBuyerLocationPicker}
                onConfirmReception={handleConfirmReception}
                onSendLot={handleSendLot}
                onVerifyDeliveryToken={verifyDeliveryToken}
                onOpenDispute={openDisputeModal}
                styles={styles}
                colors={colors}
            />
            <DisputeModal
                visible={isDisputeModalVisible}
                transaction={selectedDisputeTransaction}
                onClose={closeDisputeModal}
                onSubmit={submitDispute}
                styles={styles}
                colors={colors}
            />
            {showLocationPicker && (
                <LocationPicker
                    initialLocation={locationInitial || undefined}
                    onLocationSelect={handleLocationSelect}
                    onClose={closeLocationPicker}
                    colors={colors}
                    styles={sellerStyles}
                />
            )}
        </SafeAreaView>
    );
};

// Default export for this module.
export default TransactionsScreen;

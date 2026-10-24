// File: frontend/src/components/transactions/DesktopDetailPanel.tsx
// Panel component for desktop detail panel.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Transaction, TransactionStatus, STATUS_BADGE, formatOrderId, TRACKER_STEPS } from '@/utils/transaction-helpers';
import ChatPanel from '@/components/transactions/ChatPanel';
import logger from '@/utils/logger';
import { InputField } from '@/components/ui/InputField';

// Type declaration DesktopDetailPanelProps.
interface DesktopDetailPanelProps {
    activeTab: 'sales' | 'purchases';
    selectedSale: Transaction | null;
    selectedPurchase: Transaction | null;
    desktopSubTab: 'detail' | 'chat';
    setDesktopSubTab: (tab: 'detail' | 'chat') => void;
    user: any;
    handleProofUpload: (txId: string, file: any) => Promise<void>;
    onConfirmReception: (txId: string) => Promise<void>;
    onSendLot: (txId: string) => Promise<void>;
    onVerifyDeliveryToken: (txId: string, token: string) => Promise<void>;
    sendBuyerFarmLocation: (txtId: string) => Promise<void>;
    onOpenDispute: (transaction: Transaction) => void;
    styles: any;
    colors: any;
}

// Exported constant DesktopDetailPanel.
export const DesktopDetailPanel: React.FC<DesktopDetailPanelProps> = ({
    activeTab,
    selectedSale,
    selectedPurchase,
    desktopSubTab,
    setDesktopSubTab,
    user,
    handleProofUpload,
    onConfirmReception,
    onSendLot,
    onVerifyDeliveryToken,
    sendBuyerFarmLocation,
    onOpenDispute,
    styles,
    colors,
}) => {
    const isSalesTab = activeTab === 'sales';
    const item = isSalesTab ? selectedSale : selectedPurchase;
    const hasBuyerDelivery = Boolean(item?.buyerDeliveryAddress || item?.buyerDeliveryLat || item?.buyerDeliveryLng);

    const handleUploadProof = async () => {
        if (!item) return;
        try {
            const res = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
            if (!res.canceled && res.assets && res.assets.length > 0) {
                const asset = res.assets[0];
                const file = { uri: asset.uri, name: asset.name, type: asset.mimeType || 'application/octet-stream' } as any;
                await handleProofUpload(item.id, file);
            }
        } catch (e) {
            logger.warn('upload proof error', { error: e });
        }
    };

    const handleViewProof = () => {
        if (!item?.buyerProof) return;
        if (typeof window !== 'undefined' && window.open) {
            window.open(item.buyerProof, '_blank');
        }
    };

    const [deliveryTokenInput, setDeliveryTokenInput] = useState('');

    const sendBuyerLocation = async () => {
        if (!item) return;
        await sendBuyerFarmLocation(item.id);
    };

    const handleVerifyToken = async () => {
        if (!item || !deliveryTokenInput.trim()) return;
        try {
            await onVerifyDeliveryToken(item.id, deliveryTokenInput.trim());
            setDeliveryTokenInput('');
        } catch (err) {
            logger.warn('Token verification failed', { error: err });
        }
    };

    if (!item) {
        return (
            <View style={[styles.desktopDetailPanel, styles.emptyState]}>
                <View style={styles.emptyStateIcon}>
                    <MaterialIcons name="inventory" size={32} color={colors.brand} />
                </View>
                <Text style={styles.emptyTitle}>No hay transacciones para mostrar</Text>
                <Text style={styles.emptySubtitle}>Todavía no tienes ventas o compras en este panel. Revisa tu actividad o vuelve más tarde.</Text>
            </View>
        );
    }

    const counterpart = isSalesTab ? item.buyerName : item.sellerName;
    const badge = STATUS_BADGE[item.status as TransactionStatus] || STATUS_BADGE.pending;

    return (
        <View style={styles.desktopDetailPanel}>
            <View style={styles.desktopDetailImage}>
                <Image source={{ uri: item.product?.img }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <View style={styles.desktopDetailImageOverlay} />
                <View style={styles.desktopDetailImageContent}>
                    <Text style={styles.desktopDetailImageTitle}>{item.product?.title}</Text>
                    <Text style={styles.desktopDetailImageSub}>{item.product?.location || 'Ubicación no disponible'}</Text>
                </View>
                <View style={[styles.statusBadge, { position: 'absolute', top: 16, right: 16, backgroundColor: badge.bg, borderColor: badge.color + '40' }]}>
                    <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                </View>
            </View>

            <View style={styles.desktopDetailSubTabs}>
                {(['detail', 'chat'] as const).map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.desktopDetailSubTab, desktopSubTab === t && styles.desktopDetailSubTabActive]}
                        onPress={() => setDesktopSubTab(t)}
                    >
                        <MaterialIcons
                            name={t === 'detail' ? 'info-outline' : 'chat-bubble-outline'}
                            size={15}
                            color={desktopSubTab === t ? colors.brand : colors.mutedText}
                        />
                        <Text style={[styles.desktopDetailSubTabText, desktopSubTab === t && styles.desktopDetailSubTabTextActive]}>
                            {t === 'detail' ? 'Detalle' : `Chat con ${counterpart}`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {desktopSubTab === 'detail' ? (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 16 }}>
                    <View style={styles.desktopDetailInfoGrid}>
                        {[
                            { label: 'Orden', value: formatOrderId(isSalesTab ? selectedSale?.id || '' : selectedPurchase?.id || '', isSalesTab ? 'S' : 'P') },
                            { label: isSalesTab ? 'Comprador' : 'Vendedor', value: counterpart },
                            { label: 'Raza', value: item.product?.breed || '—' },
                            { label: 'Categoría', value: item.product?.category || '—' },
                            { label: 'Peso', value: item.product?.weight || '—' },
                            { label: 'Cabezas', value: String(item.product?.heads || '—') },
                        ].map(({ label, value }) => (
                            <View key={label} style={styles.desktopDetailInfoCell}>
                                <Text style={styles.desktopDetailInfoLabel}>{label}</Text>
                                <Text style={styles.desktopDetailInfoValue}>{value}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.desktopDetailCard}>
                        <Text style={styles.desktopDetailCardTitle}>Estado del pedido</Text>
                        <View style={styles.trackerWrapper}>
                            <View style={styles.trackerLine}>
                                <View style={[styles.trackerLineProgress, { width: `${(item.currentStep / 3) * 100}%` }]} />
                            </View>
                            <View style={styles.trackerSteps}>
                                {TRACKER_STEPS.map((step, index) => {
                                    const isActive = index <= item.currentStep;

                                    return (
                                        <View key={step.key} style={styles.trackerStep}>
                                            <View style={[
                                                styles.trackerDot,
                                                isActive ? styles.trackerDotActive : styles.trackerDotInactive
                                            ]}>
                                                {isActive && <MaterialIcons
                                                    name={step.icon}
                                                    size={14}
                                                    color="#fff"
                                                />}
                                            </View>

                                            <Text style={[
                                                styles.trackerStepLabel,
                                                isActive && styles.trackerStepLabelActive
                                            ]}>
                                                {step.label}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    {item.buyerDeliveryAddress ? (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 16 }]}>
                            <Text style={styles.desktopDetailCardTitle}>Dirección de entrega</Text>
                            <Text style={styles.desktopDetailInfoValue}>{item.buyerDeliveryAddress}</Text>
                            {item.buyerDeliveryLat && item.buyerDeliveryLng ? (
                                <Text style={[styles.locationText, { marginTop: 6 }]}>Lat: {item.buyerDeliveryLat} · Lng: {item.buyerDeliveryLng}</Text>
                            ) : null}
                        </View>
                    ) : null}

                    {item.status === 'in_transit' && item.deliveryToken && user?.id === item.buyerId && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 16 }]}>
                            <Text style={styles.desktopDetailCardTitle}>Código de entrega</Text>
                            <Text style={styles.desktopDetailInfoValue}>{item.deliveryToken}</Text>
                            <Text style={[styles.locationText, { marginTop: 6 }]}>Compártelo con el vendedor cuando reciba el lote.</Text>
                        </View>
                    )}

                    {item.status === 'paid' && user?.id === item.sellerId && !item.buyerDeliveryAddress && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 16 }]}>
                            <Text style={styles.desktopDetailCardTitle}>Esperando ubicación</Text>
                            <Text style={styles.locationText}>No puedes enviar el lote hasta que el comprador comparta la ubicación de entrega.</Text>
                        </View>
                    )}

                    {item.status === 'in_transit' && user?.id === item.sellerId && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 16 }]}>
                            <Text style={styles.desktopDetailCardTitle}>Validar entrega</Text>
                            <InputField
                                placeholder="Código de entrega"
                                value={deliveryTokenInput}
                                onChangeText={(text: string) => setDeliveryTokenInput(text.replace(/[^0-9]/g, '').slice(0, 6))}
                                keyboardType="numeric"
                                maxLength={6}
                                wrapperStyle={{ marginTop: 12, height: 44, justifyContent: 'center' }}
                                style={[styles.input, { height: 42, paddingVertical: 0, textAlignVertical: 'center' as any }]}
                            />
                            <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={handleVerifyToken} activeOpacity={0.8}>
                                <Text style={styles.btnPrimaryText}>Confirmar entrega</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {user?.id === item.buyerId && !item.buyerProof && (
                        <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={handleUploadProof} activeOpacity={0.8}>
                            <Text style={styles.btnPrimaryText}>Subir comprobante</Text>
                        </TouchableOpacity>
                    )}
                    {item.status === 'paid' && user?.id === item.buyerId && !hasBuyerDelivery && (
                        <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={sendBuyerLocation} activeOpacity={0.8}>
                            <Text style={styles.btnPrimaryText}>Enviar ubicación de la finca</Text>
                        </TouchableOpacity>
                    )}
                    {item.status === 'paid' && user?.id === item.buyerId && hasBuyerDelivery && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 14, marginTop: 12, backgroundColor: colors.verificationBoxBackground }]}>
                            <Text style={[styles.desktopDetailCardTitle, { color: colors.textColor }]}>Ubicación enviada</Text>
                            <Text style={[styles.locationText, { marginTop: 6 }]}>Gracias, tu ubicación de la finca ya fue compartida con el vendedor.</Text>
                        </View>
                    )}
                    {user?.id === item.sellerId && item.status === 'paid' && item.buyerDeliveryAddress && (
                        <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={() => onSendLot(item.id)} activeOpacity={0.8}>
                            <Text style={styles.btnPrimaryText}>Enviar lote</Text>
                        </TouchableOpacity>
                    )}
                    <View style={[styles.listingActionsRow, { marginTop: 12 }]}>
                        {item.buyerProof && (
                            <TouchableOpacity style={styles.btnPrimaryStandalone} onPress={handleViewProof} activeOpacity={0.8}>
                                <Text style={styles.btnPrimaryText}>Ver comprobante de pago</Text>
                            </TouchableOpacity>
                        )}
                        {item.status !== 'disputed' && (
                            <TouchableOpacity style={styles.btnSecondary} onPress={() => onOpenDispute(item)} activeOpacity={0.8}>
                                <Text style={styles.btnSecondaryText}>Abrir disputa</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            ) : (
                <View style={{ flex: 1 }}>
                    <ChatPanel transactionId={item.id} counterpart={counterpart} styles={styles} colors={colors} />
                </View>
            )}
        </View>
    );
};

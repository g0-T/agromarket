// File: frontend/src/components/transactions/TransactionCards.tsx
// Card component for transaction cards.
import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/use-auth';
import ChatPanel from '@/components/transactions/ChatPanel';
import { formatOrderId, STATUS_BADGE, Transaction, TransactionStatus } from '@/utils/transaction-helpers';
import logger from '@/utils/logger';
import { InputField } from '@/components/ui/InputField';
import { getSocketUrl } from '@/utils/api-config';

const formatProofUrl = (url?: string) => {
    if (!url) return '';

    const trimmedUrl = url.trim();
    if (/^https?:\/\//i.test(trimmedUrl) || /^file:\/\//i.test(trimmedUrl) || /^data:/i.test(trimmedUrl)) {
        return trimmedUrl;
    }

    const baseUrl = getSocketUrl();
    const normalizedPath = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;

    return `${baseUrl}${normalizedPath}`;
};

const openUrl = async (url?: string) => {
    if (!url) {
        Alert.alert('Error', 'El enlace del comprobante no es válido o está vacío.');
        return;
    }

    const targetUrl = formatProofUrl(url);

    try {
        const supported = await Linking.canOpenURL(targetUrl);
        if (supported) {
            await Linking.openURL(targetUrl);
        } else {
            Alert.alert('Error', 'El sistema no sabe cómo abrir este tipo de archivo.');
        }
    } catch (error) {
        logger.error('Error opening URL', { error, url: targetUrl });
        Alert.alert('Error', 'No se pudo abrir el comprobante en el navegador.');
    }
};

const VerifyTokenBox = ({ styles, colors, value, onChange, onVerify }: any) => {
    const [status, setStatus] = useState<null | { type: 'success' | 'error'; msg: string }>(null);

    const tryVerify = async () => {
        if (!onVerify) return;
        if (!value || value.length !== 6) {
            setStatus({ type: 'error', msg: 'El token debe tener 6 dígitos' });
            setTimeout(() => setStatus(null), 3000);
            return;
        }
        try {
            await onVerify();
            setStatus({ type: 'success', msg: 'Entrega confirmada' });
            setTimeout(() => setStatus(null), 3000);
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Token inválido';
            setStatus({ type: 'error', msg });
            setTimeout(() => setStatus(null), 4000);
        }
    };

    return (
        <View>
            <InputField
                placeholder="Ingresa el token"
                value={value}
                onChangeText={(t: string) => onChange(t.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="numeric"
                maxLength={6}
                wrapperStyle={{ height: 44 }}
            />
            <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={tryVerify} activeOpacity={0.8}>
                <Text style={styles.btnPrimaryText}>Validar entrega</Text>
            </TouchableOpacity>
            {status && (
                <View style={[styles.desktopDetailCard, { marginTop: 12, backgroundColor: status.type === 'success' ? colors.verificationBoxBackground : colors.errorBackground }]}>
                    <Text style={[styles.desktopDetailCardTitle, { color: colors.textColor }]}>{status.msg}</Text>
                </View>
            )}
        </View>
    );
};

export const TrackerBar = ({ currentStep, styles }: { currentStep: number; styles: any }) => {
    const progress = Math.max(0, Math.min(1, currentStep / 3));
    return (
        <View style={styles.trackerWrapper}>
            <View style={styles.trackerLine}>
                <View style={[styles.trackerLineProgress, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.trackerSteps}>
                {['Pendiente', 'Pagado', 'En tránsito', 'Completado'].map((label, index) => (
                    <View key={label} style={styles.trackerStep}>
                        <View style={[styles.trackerDot, index <= currentStep ? styles.trackerDotActive : styles.trackerDotInactive]}>
                            {index <= currentStep && <MaterialIcons name={['hourglass-empty', 'attach-money', 'local-shipping', 'check-circle'][index] as any} size={14} color="#fff" />}
                        </View>
                        <Text style={[styles.trackerStepLabel, index <= currentStep && styles.trackerStepLabelActive]}>{label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const handleDocumentPick = async (onUpload: (file: any) => Promise<void>) => {
    try {
        const res = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true });
        if (!res.canceled && res.assets && res.assets.length > 0) {
            const asset = res.assets[0];
            const file = { uri: asset.uri, name: asset.name, type: asset.mimeType || 'application/octet-stream' } as any;
            await onUpload(file);
        }
    } catch (e) {
        logger.warn('upload proof error', { error: e });
    }
};

export const DesktopListRow = ({ title, subtitle, orderId, status, imgUri, isSelected, onPress, styles, colors }: any) => {
    const statusKey = status as TransactionStatus;
    const badge = STATUS_BADGE[statusKey] || STATUS_BADGE.pending;
    return (
        <TouchableOpacity style={[styles.desktopListItem, isSelected && styles.desktopListItemSelected]} onPress={onPress} activeOpacity={0.85}>
            {isSelected && <View style={styles.desktopListSelectedBar} />}
            <View style={styles.desktopListThumb}>
                <Image source={{ uri: imgUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.desktopListOrderId}>{orderId}</Text>
                <Text style={styles.desktopListTitle} numberOfLines={1}>{title}</Text>
                <Text style={styles.desktopListSub} numberOfLines={1}>{subtitle}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.color + '40', alignSelf: 'center' }]}>
                <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const MobilePurchaseCard = memo(({
    purchase: tx,
    styles,
    colors,
    onUploadProof,
    onConfirmReception,
    onSendLot,
    onOpenDispute,
    sendBuyerFarmLocation
}: {
    purchase: Transaction;
    styles: any;
    colors: any;
    onUploadProof: (txId: string, file: any) => Promise<void>;
    onConfirmReception?: (txId: string) => Promise<void>;
    onSendLot: (txId: string) => Promise<void>;
    onOpenDispute?: (transaction: Transaction) => void;
    sendBuyerFarmLocation: (txId: string) => Promise<void>;
}) => {
    const [subTab, setSubTab] = useState<'detail' | 'chat'>('detail');
    const [isActionLoading, setIsActionLoading] = useState(false);

    const { user } = useAuth();
    const purchaseStatus = tx.status as TransactionStatus;
    const badge = STATUS_BADGE[purchaseStatus] || STATUS_BADGE.pending;
    const hasBuyerDelivery = Boolean(tx.buyerDeliveryAddress || tx.buyerDeliveryLat || tx.buyerDeliveryLng);

    const localUploadProof = async (file: any) => {
        setIsActionLoading(true);
        try {
            await onUploadProof(tx.id, file);
        } finally {
            setIsActionLoading(false);
        }
    };

    const localSendLot = async () => {
        setIsActionLoading(true);
        try {
            await onSendLot(tx.id);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <View style={styles.purchaseCard}>
            <View style={styles.purchaseHeader}>
                <View style={styles.purchaseHeaderLeft}>
                    <View style={styles.purchaseThumb}>
                        <Image source={{ uri: tx.product?.img }} style={styles.purchaseThumbImg} resizeMode="cover" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.purchaseOrderId}>{formatOrderId(tx.id, 'P')}</Text>
                        <Text style={styles.purchaseTitle} numberOfLines={1}>{tx.product?.title}</Text>
                        <Text style={styles.purchaseSeller}>Vendedor: {tx.sellerName}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.color + '40' }]}>
                    <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                </View>
            </View>

            <View style={styles.subTabsRow}>
                {(['detail', 'chat'] as const).map(t => (
                    <TouchableOpacity key={t} style={[styles.subTab, subTab === t && styles.subTabActive]} onPress={() => setSubTab(t)}>
                        <MaterialIcons name={t === 'detail' ? 'info-outline' : 'chat-bubble-outline'} size={13} color={subTab === t ? colors.brand : colors.mutedText} />
                        <Text style={[styles.subTabText, subTab === t && styles.subTabTextActive]}>{t === 'detail' ? 'Detalle' : 'Chat'}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {subTab === 'detail' ? (
                <>
                    <TrackerBar currentStep={tx.currentStep} styles={styles} />
                    {hasBuyerDelivery && (
                        <View style={[styles.locationRow, { flexWrap: 'wrap', alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 10 }]}>
                            <View style={[styles.locationLeft, { flexShrink: 1, minWidth: 0, alignItems: 'flex-start' }]}>
                                <MaterialIcons name="location-on" size={16} color={colors.brand} />
                                <Text style={[styles.locationText, { flex: 1 }]}>
                                    Ubicación: <Text style={styles.locationValue}>{tx.location}</Text>
                                </Text>
                            </View>
                        </View>
                    )}
                    {user?.id === tx.buyerId && !tx.buyerProof && (
                        <TouchableOpacity
                            style={[styles.btnPrimaryStandalone, { marginTop: 12 }]}
                            onPress={() => handleDocumentPick(localUploadProof)}
                            disabled={isActionLoading}
                        >
                            <Text style={styles.btnPrimaryText}>{isActionLoading ? 'Subiendo...' : 'Subir comprobante'}</Text>
                        </TouchableOpacity>
                    )}
                    {tx.status === 'in_transit' && tx.deliveryToken && user?.id === tx.buyerId && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 14, marginTop: 12 }]}>
                            <Text style={[styles.desktopDetailCardTitle, { marginBottom: 8 }]}>Código de entrega</Text>
                            <Text style={styles.purchaseTitle}>{tx.deliveryToken}</Text>
                            <Text style={[styles.locationText, { marginTop: 8 }]}>Preséntalo al vendedor cuando reciba el lote.</Text>
                        </View>
                    )}
                    {user?.id === tx.buyerId && tx.status === 'paid' && !hasBuyerDelivery && (
                        <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={() => sendBuyerFarmLocation(tx.id)} activeOpacity={0.8}>
                            <Text style={styles.btnPrimaryText}>Enviar ubicación de la finca</Text>
                        </TouchableOpacity>
                    )}
                    {user?.id === tx.buyerId && tx.status === 'paid' && hasBuyerDelivery && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 14, marginTop: 12, backgroundColor: colors.verificationBoxBackground }]}>
                            <Text style={[styles.desktopDetailCardTitle, { color: colors.textColor }]}>Ubicación enviada</Text>
                            <Text style={[styles.locationText, { marginTop: 6 }]}>Gracias, tu ubicación de la finca ya fue compartida con el vendedor.</Text>
                        </View>
                    )}
                    {user?.id === tx.sellerId && tx.status === 'paid' && (
                        <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={localSendLot} activeOpacity={0.8} disabled={isActionLoading}>
                            <Text style={styles.btnPrimaryText}>Enviar lote</Text>
                        </TouchableOpacity>
                    )}
                    {tx.buyerProof && (
                        <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={() => openUrl(tx.buyerProof)}>
                            <Text style={styles.btnPrimaryText}>Ver comprobante</Text>
                        </TouchableOpacity>
                    )}

                    {tx.status === 'completed' && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 12, marginTop: 12, backgroundColor: colors.verificationBoxBackground }]}>
                            <Text style={[styles.desktopDetailCardTitle, { color: colors.textColor }]}>Transacción completada</Text>
                            <Text style={[styles.locationText, { color: colors.textColor }]}>La entrega ha sido confirmada. Gracias.</Text>
                        </View>
                    )}
                    {tx.status !== 'disputed' && onOpenDispute && (
                        <TouchableOpacity style={[styles.btnSecondary, { marginTop: 12 }]} onPress={() => onOpenDispute(tx)} activeOpacity={0.8}>
                            <Text style={styles.btnSecondaryText}>Abrir disputa</Text>
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <View style={{ height: 340 }}>
                    <ChatPanel transactionId={tx.id} counterpart={tx.sellerName} styles={styles} colors={colors} />
                </View>
            )}
        </View>
    );
});

export const MobileSaleCard = memo(({
    sale: tx,
    styles,
    colors,
    onVerifyDeliveryToken,
    onSendLot,
    onOpenDispute
}: {
    sale: Transaction;
    styles: any;
    colors: any;
    onVerifyDeliveryToken?: (txId: string, token: string) => Promise<void>;
    onSendLot: (txId: string) => Promise<void>;
    onOpenDispute?: (transaction: Transaction) => void;
}) => {
    const [subTab, setSubTab] = useState<'detail' | 'chat'>('detail');
    const [deliveryTokenInput, setDeliveryTokenInput] = useState('');
    const [isActionLoading, setIsActionLoading] = useState(false);

    const { user } = useAuth();
    const saleStatus = tx.status as TransactionStatus;
    const badge = STATUS_BADGE[saleStatus] || STATUS_BADGE.pending;

    return (
        <View style={styles.purchaseCard}>
            <View style={styles.purchaseHeader}>
                <View style={styles.purchaseHeaderLeft}>
                    <View style={styles.purchaseThumb}>
                        <Image source={{ uri: tx.product?.img }} style={styles.purchaseThumbImg} resizeMode="cover" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.purchaseOrderId}>{formatOrderId(tx.id, 'S')}</Text>
                        <Text style={styles.purchaseTitle} numberOfLines={1}>{tx.product?.title}</Text>
                        <Text style={styles.purchaseSeller}>Comprador: {tx.buyerName}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.color + '40' }]}>
                    <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                </View>
            </View>

            <View style={styles.subTabsRow}>
                {(['detail', 'chat'] as const).map(t => (
                    <TouchableOpacity key={t} style={[styles.subTab, subTab === t && styles.subTabActive]} onPress={() => setSubTab(t)}>
                        <MaterialIcons name={(t === 'detail' ? 'inventory' : 'chat-bubble-outline') as any} size={13} color={subTab === t ? colors.brand : colors.mutedText} />
                        <Text style={[styles.subTabText, subTab === t && styles.subTabTextActive]}>{t === 'detail' ? 'Detalle' : 'Chat'}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {subTab === 'detail' ? (
                <>
                    <TrackerBar currentStep={tx.currentStep} styles={styles} />
                    {tx.buyerDeliveryAddress && (
                        <View style={[styles.locationRow, { flexWrap: 'wrap', alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 10, marginTop: 12 }]}>
                            <View style={[styles.locationLeft, { flexShrink: 1, minWidth: 0, alignItems: 'flex-start' }]}>
                                <MaterialIcons name="location-on" size={16} color={colors.brand} />
                                <Text style={[styles.locationText, { flex: 1 }]}>
                                    Ubicación de entrega: <Text style={styles.locationValue}>{tx.location}</Text>
                                </Text>
                            </View>
                        </View>
                    )}
                    {tx.status === 'paid' && tx.buyerDeliveryAddress && user?.id === tx.sellerId && (
                        <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={async () => {
                            setIsActionLoading(true);
                            try { await onSendLot(tx.id); } finally { setIsActionLoading(false); }
                        }} activeOpacity={0.8} disabled={isActionLoading}>
                            <Text style={styles.btnPrimaryText}>Enviar lote</Text>
                        </TouchableOpacity>
                    )}

                    {tx.status === 'paid' && !tx.buyerDeliveryAddress && user?.id === tx.sellerId && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 14, marginTop: 12 }]}>
                            <Text style={[styles.desktopDetailCardTitle, { marginBottom: 8 }]}>Esperando ubicación del comprador</Text>
                            <Text style={styles.locationText}>No puedes enviar el lote hasta que el comprador comparta la ubicación de entrega.</Text>
                        </View>
                    )}
                    {tx.status === 'in_transit' && tx.deliveryToken && user?.id === tx.buyerId && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 14, marginTop: 12 }]}>
                            <Text style={[styles.desktopDetailCardTitle, { marginBottom: 8 }]}>Código de entrega</Text>
                            <Text style={styles.purchaseTitle}>{tx.deliveryToken}</Text>
                            <Text style={[styles.locationText, { marginTop: 8 }]}>Pídele este código al vendedor cuando entregue el lote.</Text>
                        </View>
                    )}

                    {tx.status === 'in_transit' && user?.id === tx.sellerId && onVerifyDeliveryToken && (
                        <View style={[styles.desktopDetailCard, { paddingVertical: 14, marginTop: 12 }]}>
                            <Text style={[styles.desktopDetailCardTitle, { marginBottom: 8 }]}>Confirmar entrega</Text>
                            <VerifyTokenBox
                                styles={styles}
                                colors={colors}
                                value={deliveryTokenInput}
                                onChange={(text: string) => setDeliveryTokenInput(text)}
                                onVerify={async () => {
                                    await onVerifyDeliveryToken(tx.id, deliveryTokenInput);
                                    setDeliveryTokenInput('');
                                }}
                            />
                        </View>
                    )}

                    {tx.buyerProof && (
                        <TouchableOpacity style={[styles.btnPrimaryStandalone, { marginTop: 12 }]} onPress={() => openUrl(tx.buyerProof)} activeOpacity={0.8}>
                            <Text style={styles.btnPrimaryText}>Ver comprobante de pago</Text>
                        </TouchableOpacity>
                    )}
                    {tx.status !== 'disputed' && onOpenDispute && (
                        <TouchableOpacity style={[styles.btnSecondary, { marginTop: 12 }]} onPress={() => onOpenDispute(tx)} activeOpacity={0.8}>
                            <Text style={styles.btnSecondaryText}>Abrir disputa</Text>
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <View style={{ height: 340 }}>
                    <ChatPanel transactionId={tx.id} counterpart={tx.buyerName} styles={styles} colors={colors} />
                </View>
            )}
        </View>
    );
});

// File: frontend/src/components/admin/TransactionModal.tsx
// Modal component for transaction modal.

import React, { useState } from 'react';
import logger from '@/utils/logger';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '@/utils/currency';
import { InputField } from '@/components/ui/InputField';

import { Transaction } from '@/hooks/admin/use-admin-dashboard-data';

// Type declaration TransactionModalProps.
interface TransactionModalProps {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
    onResolveDispute?: (id: string, status: 'resolved' | 'closed', notes?: string) => Promise<void>;
    colors: any;
    styles: any;
}

// Component for transaction modal.
const TransactionModal: React.FC<TransactionModalProps> = ({ visible, transaction, onClose, onResolveDispute, colors, styles }) => {
    const [adminNotes, setAdminNotes] = useState('');
    const [resolving, setResolving] = useState(false);

    if (!transaction) return null;

    const getDocuments = (apps?: any[]) => {
        if (!Array.isArray(apps) || apps.length === 0) return { cedula: null, hierro: null };
        const latestApp = apps[apps.length - 1];
        return {
            cedula: latestApp.attachments?.[0] || null,
            hierro: latestApp.attachments?.[1] || null
        };
    };

    const buyerDocs = getDocuments(transaction.buyer?.sellerApplications);
    const sellerDocs = getDocuments(transaction.seller?.sellerApplications);
    const activeDispute = transaction.disputes && transaction.disputes.length > 0 ? transaction.disputes[0] : null;

    const handleResolve = async (status: 'resolved' | 'closed') => {
        if (!activeDispute || !onResolveDispute) return;
        Alert.alert(
            'Confirmar resolución',
            `¿Estás seguro de que quieres ${status === 'resolved' ? 'resolver a favor del usuario' : 'cerrar'} esta disputa?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        setResolving(true);
                        try {
                            await onResolveDispute(activeDispute.id, status, adminNotes.trim() || undefined);
                            onClose();
                        } catch (error) {
                            logger.error(error, { context: 'AdminTransactionModal.handleResolve' });
                        } finally {
                            setResolving(false);
                            setAdminNotes('');
                        }
                    },
                },
            ]
        );
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Detalles de Transacción</Text>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialIcons name="close" size={24} color={colors.textColor} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.modalInner}>
                        {activeDispute && (
                            <View style={styles.disputeSection}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <MaterialIcons name="warning" size={24} color="#ef4444" />
                                    <Text style={[styles.sectionTitle, { color: '#ef4444', marginLeft: 8, marginBottom: 0 }]}>
                                        Disputa Activa
                                    </Text>
                                </View>
                                <Text style={{ fontWeight: 'bold', color: '#fda4af' }}>Motivo:</Text>
                                <Text style={{ color: '#ee9292', marginBottom: 10 }}>{activeDispute.reason}</Text>

                                {activeDispute.attachments && activeDispute.attachments.length > 0 && (
                                    <View style={{ marginBottom: 15 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#fda4af', marginBottom: 8 }}>Fotos de evidencia:</Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                            {activeDispute.attachments.map((photo: any, index: number) => (
                                                <TouchableOpacity
                                                    key={photo.id || index}
                                                    onPress={() => Linking.openURL(photo.url)}
                                                    style={{ width: 90, marginBottom: 10 }}
                                                >
                                                    <Image
                                                        source={{ uri: photo.url }}
                                                        style={{ width: 90, height: 90, borderRadius: 12, borderWidth: 1, borderColor: '#ef4444' }}
                                                        resizeMode="cover"
                                                    />
                                                    <Text style={{ color: '#ef4444', marginTop: 6, fontSize: 12, textAlign: 'center' }}>
                                                        Evidencia {index + 1}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {activeDispute.status === 'open' && (
                                    <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: '#fca5a5', paddingTop: 10 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#fda4af', marginBottom: 5 }}>Resolución (Admin):</Text>
                                        <InputField
                                            placeholder="Agregar notas de la resolución..."
                                            value={adminNotes}
                                            onChangeText={setAdminNotes}
                                            multiline
                                        />
                                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                            <TouchableOpacity
                                                style={{ flex: 1, backgroundColor: '#22c55e', padding: 12, borderRadius: 8, alignItems: 'center' }}
                                                onPress={() => handleResolve('resolved')}
                                                disabled={resolving}
                                            >
                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Resolver a favor</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ flex: 1, backgroundColor: '#ef4444', padding: 12, borderRadius: 8, alignItems: 'center' }}
                                                onPress={() => handleResolve('closed')}
                                                disabled={resolving}
                                            >
                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar Disputa</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        <View style={styles.participantsSection}>
                            <View style={styles.participantCard}>
                                <Text style={styles.participantLabel}>Comprador</Text>
                                <Text style={styles.participantName}>{transaction.buyer?.name || transaction.buyerName}</Text>

                                {!transaction.buyerDeliveryAddress ? null : (
                                    <View style={{ marginTop: 12 }}>
                                        <Text style={styles.participantLabel}>Ubicación de entrega</Text>
                                        <Text style={styles.participantDetail}>{transaction.buyerDeliveryAddress}</Text>
                                    </View>
                                )}

                                <View style={{ marginTop: 12 }}>
                                    <Text style={styles.participantLabel}>Cédula</Text>
                                    {buyerDocs.cedula ? (
                                        <TouchableOpacity onPress={() => Linking.openURL(buyerDocs.cedula.url)} style={styles.proofCard}>
                                            <MaterialIcons name="badge" size={18} color={colors.brand} />
                                            <Text style={styles.proofText}>Ver cédula</Text>
                                        </TouchableOpacity>
                                    ) : <Text style={styles.participantDetail}>No han subido</Text>}

                                    <Text style={[styles.participantLabel, { marginTop: 10 }]}>Hierro</Text>
                                    {buyerDocs.hierro ? (
                                        <TouchableOpacity onPress={() => Linking.openURL(buyerDocs.hierro.url)} style={styles.proofCard}>
                                            <MaterialIcons name="branding-watermark" size={18} color={colors.brand} />
                                            <Text style={styles.proofText}>Ver hierro</Text>
                                        </TouchableOpacity>
                                    ) : <Text style={styles.participantDetail}>No han subido</Text>}
                                </View>
                            </View>

                            <View style={styles.participantCard}>
                                <Text style={styles.participantLabel}>Vendedor</Text>
                                <Text style={styles.participantName}>{transaction.seller?.name || transaction.sellerName}</Text>

                                <View style={{ marginTop: 12 }}>
                                    <Text style={styles.participantLabel}>Cédula</Text>
                                    {sellerDocs.cedula ? (
                                        <TouchableOpacity onPress={() => Linking.openURL(sellerDocs.cedula.url)} style={styles.proofCard}>
                                            <MaterialIcons name="badge" size={18} color={colors.brand} />
                                            <Text style={styles.proofText}>Ver cédula</Text>
                                        </TouchableOpacity>
                                    ) : <Text style={styles.participantDetail}>No han subido</Text>}

                                    <Text style={[styles.participantLabel, { marginTop: 10 }]}>Hierro</Text>
                                    {sellerDocs.hierro ? (
                                        <TouchableOpacity onPress={() => Linking.openURL(sellerDocs.hierro.url)} style={styles.proofCard}>
                                            <MaterialIcons name="branding-watermark" size={18} color={colors.brand} />
                                            <Text style={styles.proofText}>Ver hierro</Text>
                                        </TouchableOpacity>
                                    ) : <Text style={styles.participantDetail}>No han subido</Text>}
                                </View>
                            </View>
                        </View>

                        <View style={styles.chatSection}>
                            <Text style={styles.sectionTitle}>Historial de Chat (Auditoría)</Text>
                            <ScrollView
                                style={styles.chatMessages}
                                contentContainerStyle={{ paddingBottom: 12 }}
                                nestedScrollEnabled
                                showsVerticalScrollIndicator={false}
                            >
                                {!transaction.chatMessages || transaction.chatMessages.length === 0 ? (
                                    <View style={{ flex: 1, justifyContent: 'center', minHeight: 200 }}>
                                        <Text style={{ color: colors.mutedText, textAlign: 'center' }}>
                                            No hay mensajes registrados en esta transacción.
                                        </Text>
                                    </View>
                                ) : (
                                    transaction.chatMessages.map((msg: any, index: number) => {
                                        const isSellerMessage = msg.senderId === transaction.seller?.id;
                                        const senderName = isSellerMessage
                                            ? transaction.sellerName || 'Vendedor'
                                            : transaction.buyerName || 'Comprador';
                                        const fromMe = isSellerMessage;

                                        return (
                                            <View
                                                key={msg.id || index}
                                                style={[
                                                    styles.chatBubbleWrapper,
                                                    fromMe ? styles.chatBubbleWrapperMe : styles.chatBubbleWrapperThem,
                                                ]}
                                            >
                                                <View style={[styles.chatBubble, fromMe ? styles.chatBubbleMe : styles.chatBubbleThem]}>
                                                    {msg.text ? (
                                                        <Text style={[styles.chatBubbleText, fromMe && styles.chatBubbleTextMe]}>
                                                            {msg.text}
                                                        </Text>
                                                    ) : null}
                                                    {msg.attachment ? (
                                                        <TouchableOpacity onPress={() => Linking.openURL(msg.attachment)} style={{ marginTop: 8 }}>
                                                            <Text style={[styles.chatBubbleText, { textDecorationLine: 'underline', color: fromMe ? '#fff' : colors.brand }]}>
                                                                Adjunto
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ) : null}
                                                </View>
                                                <Text style={styles.chatTime}>
                                                    {senderName} • {new Date(msg.createdAt).toLocaleString()}
                                                </Text>
                                            </View>
                                        );
                                    })
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

// Default export for this module.
export default TransactionModal;

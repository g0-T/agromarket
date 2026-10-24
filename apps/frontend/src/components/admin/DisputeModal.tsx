// File: frontend/src/components/admin/DisputeModal.tsx
// Modal component for dispute modal.

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Image,
    Linking,
    Alert,
    Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { InputField } from '@/components/ui/InputField';

// Type declaration Dispute.
type Dispute = {
    id: string;
    transactionId: string;
    transaction: {
        id: string;
        product: {
            title: string;
            description?: string;
            images?: string[];
        };
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
        };
        seller?: {
            id: string;
            name?: string;
            email?: string;
            phone?: string;
            image?: string;
        };
        amount: number;
        currency: string;
        status: string;
        attachments?: { id: string; type: string; url: string }[];
        createdAt: string;
    };
    initiatorId: string;
    initiator: {
        id: string;
        name?: string;
        email?: string;
    };
    reason: string;
    status: 'open' | 'resolved' | 'closed';
    adminNotes?: string;
    attachments?: { id: string; url: string; filename?: string }[];
    createdAt: string;
    updatedAt: string;
};

interface DisputeModalProps {
    visible: boolean;
    dispute: Dispute | null;
    onClose: () => void;
    onResolve: (id: string, status: 'resolved' | 'closed', notes?: string) => Promise<void>;
    colors: any;
    styles: any;
}

// Component for dispute modal.
const DisputeModal: React.FC<DisputeModalProps> = ({
    visible,
    dispute,
    onClose,
    onResolve,
    colors,
    styles,
}) => {
    const [adminNotes, setAdminNotes] = useState('');
    const [resolving, setResolving] = useState(false);

    const handleResolve = async (status: 'resolved' | 'closed') => {
        if (!dispute) return;

        Alert.alert(
            'Confirmar resolución',
            `¿Estás seguro de que quieres ${status === 'resolved' ? 'resolver' : 'cerrar'} esta disputa?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        setResolving(true);
                        try {
                            await onResolve(dispute.id, status, adminNotes.trim() || undefined);
                            onClose();
                        } catch (error) {
                            // Error is handled in the hook
                        } finally {
                            setResolving(false);
                        }
                    },
                },
            ]
        );
    };

    const openAttachment = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir el archivo adjunto');
        }
    };

    if (!dispute) return null;

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

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color={colors.textColor} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Disputa #{dispute.id.slice(0, 8)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(dispute.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(dispute.status)}</Text>
                    </View>
                </View>

                <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Información de la Transacción</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Producto:</Text>
                            <Text style={styles.detailValue}>{dispute.transaction.product.title}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Monto:</Text>
                            <Text style={styles.detailValue}>${dispute.transaction.amount} {dispute.transaction.currency}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Comprador:</Text>
                            <Text style={styles.detailValue}>{dispute.transaction.buyerName || dispute.transaction.buyer?.name}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Vendedor:</Text>
                            <Text style={styles.detailValue}>{dispute.transaction.sellerName || dispute.transaction.seller?.name}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Fecha:</Text>
                            <Text style={styles.detailValue}>{new Date(dispute.transaction.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Información de la Disputa</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Iniciada por:</Text>
                            <Text style={styles.detailValue}>{dispute.initiator.name || dispute.initiator.email}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Fecha de creación:</Text>
                            <Text style={styles.detailValue}>{new Date(dispute.createdAt).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Razón:</Text>
                            <Text style={styles.detailValue}>{dispute.reason}</Text>
                        </View>
                    </View>

                    {dispute.attachments && dispute.attachments.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Evidencia de la Disputa</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                                {dispute.attachments.map((attachment, index) => (
                                    <TouchableOpacity
                                        key={attachment.id}
                                        onPress={() => openAttachment(attachment.url)}
                                        style={{ width: 110, marginBottom: 12 }}
                                    >
                                        <Image
                                            source={{ uri: attachment.url }}
                                            style={{ width: 110, height: 110, borderRadius: 12, borderWidth: 1, borderColor: colors.brand }}
                                            resizeMode="cover"
                                        />
                                        <Text style={{ color: colors.textColor, fontSize: 12, marginTop: 6, textAlign: 'center' }} numberOfLines={1}>
                                            {attachment.filename || `Foto ${index + 1}`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {dispute.transaction.attachments && dispute.transaction.attachments.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Evidencia de la Transacción</Text>
                            <View style={styles.attachmentsContainer}>
                                {dispute.transaction.attachments.map((attachment, index) => (
                                    <TouchableOpacity
                                        key={attachment.id}
                                        style={styles.attachmentItem}
                                        onPress={() => openAttachment(attachment.url)}
                                    >
                                        <MaterialIcons name="attach-file" size={20} color={colors.brand} />
                                        <Text style={styles.attachmentText}>
                                            {attachment.type === 'buyer_proof' ? 'Comprobante de pago' : `Archivo ${index + 1}`}
                                        </Text>
                                        <MaterialIcons name="open-in-new" size={16} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {dispute.status === 'open' && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Notas del Administrador</Text>
                            <InputField
                                placeholder="Agregar notas para la resolución..."
                                value={adminNotes}
                                onChangeText={setAdminNotes}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    )}

                    {dispute.adminNotes && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Notas Previas</Text>
                            <Text style={styles.adminNotesText}>{dispute.adminNotes}</Text>
                        </View>
                    )}
                </ScrollView>

                {dispute.status === 'open' && (
                    <View style={[styles.modalActions, styles.listMaxWidth, { flexDirection: 'row', alignSelf: 'center', width: '100%' }]}> 
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: colors.brand,
                                paddingVertical: 14,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 10,
                            }}
                            onPress={() => handleResolve('resolved')}
                            activeOpacity={0.8}
                            disabled={resolving}
                        >
                            <Text style={{ color: '#fff', fontWeight: '700' }}>
                                {resolving ? 'Procesando...' : 'Resolver Disputa'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: colors.background || '#f2f2f2',
                                paddingVertical: 14,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 10,
                                borderWidth: 1,
                                borderColor: colors.border || '#ccc',
                            }}
                            onPress={() => handleResolve('closed')}
                            activeOpacity={0.8}
                            disabled={resolving}
                        >
                            <Text style={{ color: colors.textColor || '#333', fontWeight: '700' }}>
                                {resolving ? 'Procesando...' : 'Cerrar Disputa'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
};

// Default export for this module.
export default DisputeModal;

// File: frontend/src/components/transactions/DisputeModal.tsx
// Modal component for dispute modal.

import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Transaction } from '@/utils/transaction-helpers';
import logger from '@/utils/logger';

// Type declaration DisputeModalProps.
interface DisputeModalProps {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
    onSubmit: (reason: string, photos: any[]) => Promise<void>;
    styles: any;
    colors: any;
}

// Component for dispute modal.
const DisputeModal: React.FC<DisputeModalProps> = ({ visible, transaction, onClose, onSubmit, styles, colors }) => {
    const [reason, setReason] = useState('');
    const [photos, setPhotos] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!visible) {
            setReason('');
            setPhotos([]);
            setIsSubmitting(false);
        }
    }, [visible]);

    const addPhoto = async () => {
        if (photos.length >= 3) {
            Alert.alert('Límite alcanzado', 'Solo puedes adjuntar hasta 3 fotos.');
            return;
        }

        try {
            const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'], copyToCacheDirectory: true });
            const canceled = (result as any).canceled || (result as any).type === 'cancel';
            if (canceled) return;

            const asset = (result as any).assets?.[0] ?? result;
            if (!asset || !asset.uri) return;

            setPhotos(prev => [
                ...prev,
                {
                    uri: asset.uri,
                    name: asset.name || `photo-${prev.length + 1}.jpg`,
                    type: asset.mimeType || 'image/jpeg',
                },
            ]);
        } catch (err) {
            logger.warn('Dispute photo upload error', { error: err });
            Alert.alert('Error', 'No se pudo seleccionar la foto.');
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async () => {
        if (!transaction) return;
        if (!reason.trim()) {
            Alert.alert('Completa el motivo', 'Por favor describe la razón de la disputa.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(reason.trim(), photos);
        } catch (err) {
            logger.warn('Dispute submit error', { error: err });
            Alert.alert('Error', 'No se pudo enviar la disputa. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.disputeModalContainer}>
                    <View style={styles.disputeModalHeader}>
                        <View>
                            <Text style={styles.disputeModalTitle}>Abrir disputa</Text>
                            <Text style={styles.disputeModalSubtitle} numberOfLines={2}>
                                {transaction ? `Transacción ${transaction.id.slice(0, 8)} · ${transaction.product?.title}` : 'Describe el problema con la transacción.'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                            <MaterialIcons name="close" size={24} color={colors.textColor} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                        <Text style={styles.disputeModalLabel}>Motivo de la disputa</Text>
                        <TextInput
                            value={reason}
                            onChangeText={setReason}
                            placeholder="Explica claramente qué sucedió..."
                            placeholderTextColor={colors.mutedText}
                            multiline
                            style={styles.disputeModalInput}
                        />

                        <Text style={styles.disputeModalLabel}>Fotos de apoyo (hasta 3)</Text>
                        <View style={styles.disputePhotoRow}>
                            {photos.map((photo, index) => (
                                <View key={photo.uri + index} style={styles.disputePhotoThumb}>
                                    <Image source={{ uri: photo.uri }} style={styles.disputePhotoImage} resizeMode="cover" />
                                    <TouchableOpacity style={styles.disputePhotoRemove} onPress={() => removePhoto(index)}>
                                        <MaterialIcons name="close" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {photos.length < 3 && (
                                <TouchableOpacity style={styles.disputeAddPhotoButton} onPress={addPhoto} activeOpacity={0.8}>
                                    <MaterialIcons name="photo-camera" size={20} color={colors.brand} />
                                    <Text style={styles.disputeAddPhotoText}>Agregar</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.disputeModalHintText}>Puedes agregar hasta tres imágenes para apoyar tu reclamo.</Text>

                        <View style={styles.disputeModalActions}>
                            <TouchableOpacity style={[styles.disputeModalActionButton, styles.disputeModalCancelButton]} onPress={onClose} activeOpacity={0.8}>
                                <Text style={styles.disputeModalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.disputeModalActionButton, styles.disputeModalSubmitButton]}
                                onPress={handleSubmit}
                                activeOpacity={0.8}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.disputeModalSubmitText}>Enviar disputa</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

// Default export for this module.
export default DisputeModal;

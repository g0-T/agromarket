// File: frontend/src/components/admin/ApplicationModal.tsx
// Modal component for application modal.

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { InputField } from '@/components/ui/InputField';

// Type declaration AttachmentFile.
interface AttachmentFile {
    id: string;
    url: string;
    filename?: string;
    type?: 'cedula' | 'hierro' | string;
}

interface SellerApplication {
    id: string;
    user: {
        name: string;
        email: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    farmLocationLat?: number;
    farmLocationLng?: number;
    farmLocationAddress?: string;
    attachments?: AttachmentFile[];
    submittedAt: string;
    reviewedAt?: string;
    adminNotes?: string;
}

interface ApplicationModalProps {
    visible: boolean;
    application: SellerApplication | null;
    onClose: () => void;
    onApprove: (id: string, notes: string) => Promise<void>;
    onReject: (id: string, notes: string) => Promise<void>;
    colors: any;
    styles: any;
}

// Component for application modal.
const ApplicationModal: React.FC<ApplicationModalProps> = ({
    visible,
    application,
    onClose,
    onApprove,
    onReject,
    colors,
    styles,
}) => {
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    if (!application) return null;

    const handleApprove = async () => {
        setLoading(true);
        try {
            await onApprove(application.id, notes);
            onClose();
            setNotes('');
        } catch (error) {
            // Error handled in hook
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        const trimmedNotes = notes.trim();
        if (!trimmedNotes) {
            Alert.alert('Error', 'Debes ingresar una razón para rechazar.');
            return;
        }
        if (trimmedNotes.length < 20) {
            Alert.alert(
                'Aviso',
                'La razón de rechazo es muy corta. Agrega más detalles para que el vendedor entienda mejor por qué se rechazó la solicitud.'
            );
            return;
        }
        setLoading(true);
        try {
            await onReject(application.id, trimmedNotes);
            onClose();
            setNotes('');
        } catch (error) {
            // Error handled in hook
        } finally {
            setLoading(false);
        }
    };

    const openDocument = (uri: string) => {
        if (!uri) return;
        Linking.openURL(uri).catch(() => {
            Alert.alert('Error', 'No se pudo abrir el documento.');
        });
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Revisar Solicitud</Text>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialIcons name="close" size={24} color={colors.textColor} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.modalInner}>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{application.user.name}</Text>
                            <Text style={styles.userEmail}>{application.user.email}</Text>
                            <Text style={styles.submittedDate}>
                                Enviado: {new Date(application.submittedAt).toLocaleDateString()}
                            </Text>
                        </View>


                        <View style={styles.documentsSection}>
                            <Text style={styles.sectionTitle}>Documentos</Text>
                            {Array.isArray(application.attachments) && application.attachments.length > 0 ? (
                                <>
                                    {application.attachments[0] && (
                                        <TouchableOpacity
                                            style={styles.documentItem}
                                            onPress={() => openDocument(application.attachments![0].url)}
                                        >
                                            <MaterialIcons name="badge" size={20} color={colors.brand} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.documentText}>Cédula</Text>
                                                <Text style={[styles.participantDetail, { marginTop: 4 }]}>
                                                    {application.attachments[0].filename || 'cedula.jpg'}
                                                </Text>
                                            </View>
                                            <MaterialIcons name="open-in-new" size={16} color={colors.mutedText} />
                                        </TouchableOpacity>
                                    )}

                                    {application.attachments[1] && (
                                        <TouchableOpacity
                                            style={styles.documentItem}
                                            onPress={() => openDocument(application.attachments![1].url)}
                                        >
                                            <MaterialIcons name="branding-watermark" size={20} color={colors.brand} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.documentText}>Hierro</Text>
                                                <Text style={[styles.participantDetail, { marginTop: 4 }]}>
                                                    {application.attachments[1].filename || 'hierro.jpg'}
                                                </Text>
                                            </View>
                                            <MaterialIcons name="open-in-new" size={16} color={colors.mutedText} />
                                        </TouchableOpacity>
                                    )}
                                </>
                            ) : (
                                <Text style={styles.listItemSubtitle}>No hay documentos adjuntos para esta solicitud.</Text>
                            )}
                        </View>

                        {(application.farmLocationAddress || application.farmLocationLat !== undefined || application.farmLocationLng !== undefined) && (
                            <View style={styles.locationSection}>
                                <Text style={styles.sectionTitle}>Ubicación de la finca</Text>
                                <View style={styles.locationBlock}>
                                    {application.farmLocationAddress ? (
                                        <View style={styles.locationRow}>
                                            <Text style={styles.locationLabel}>Dirección</Text>
                                            <Text style={styles.locationValue}>{application.farmLocationAddress}</Text>
                                        </View>
                                    ) : null}
                                    <View style={styles.locationRow}>
                                        <Text style={styles.locationLabel}>Coordenadas</Text>
                                        <Text style={styles.locationValue}>
                                            Lat: {application.farmLocationLat ?? '—'}, Lng: {application.farmLocationLng ?? '—'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.notesSection}>
                            <Text style={styles.sectionTitle}>Notas del Administrador</Text>
                            <InputField
                                placeholder="Agregar notas...(requerido para rechazar)"
                                value={notes}
                                onChangeText={setNotes}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.modalActions, styles.listMaxWidth, { alignSelf: 'center', width: '100%' }]}>
                    {application.status === 'pending' ? (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.rejectButton]}
                                onPress={handleReject}
                                disabled={loading}
                            >
                                <Text style={styles.rejectButtonText}>Rechazar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.approveButton]}
                                onPress={handleApprove}
                                disabled={loading}
                            >
                                <Text style={styles.approveButtonText}>Aprobar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={[styles.sectionTitle, { color: application.status === 'approved' ? '#22c55e' : '#ef4444' }]}>
                                Esta solicitud ya ha sido {application.status === 'approved' ? 'aprobada' : 'rechazada'}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

// Default export for this module.
export default ApplicationModal;

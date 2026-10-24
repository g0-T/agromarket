// File: frontend/src/hooks/seller/use-become-seller.ts
// Custom hook logic for React state and side effects.

import { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import api from '@/services/api.service';
import Toast from 'react-native-toast-message';
import logger from '@/utils/logger';
import * as Location from 'expo-location';

interface DocumentFile {
    name: string;
    uri: string;
    size: number;
    type: string;
}

interface SellerApplication {
    id: string;
    status: 'pending' | 'approved' | 'rejected' | 'blocked_from_applying';
    reason?: string;
    adminNotes?: string;
    submittedAt: string;
    reviewedAt?: string;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

// Exported constant useBecomeSeller.
export const useBecomeSeller = () => {
    const [reason, setReason] = useState('');
    const [cedula, setCedula] = useState<DocumentFile | null>(null);
    const [hierro, setHierro] = useState<DocumentFile | null>(null);
    const [loading, setLoading] = useState(false);
    const [application, setApplication] = useState<SellerApplication | null>(null);
    const [loadingApplication, setLoadingApplication] = useState(true);
    const [farmLocation, setFarmLocation] = useState<{
        lat?: number;
        lng?: number;
        address?: string;
    }>({});
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    // ── Document picker ──────────────────────────────────────────────────────
    const pickDocument = async (type: 'cedula' | 'hierro') => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            const data = result as any;
            if (data.type === 'cancel' || data.canceled === true) return;

            const asset =
                Array.isArray(data.assets) && data.assets.length > 0
                    ? data.assets[0]
                    : data;

            if (!asset?.uri) {
                Alert.alert('Error', 'No se pudo obtener el archivo.');
                return;
            }

            const name =
                asset.name || asset.uri.split('/').pop() || `${type}.jpg`;

            const file: DocumentFile = {
                name,
                uri: asset.uri,
                size: asset.size ?? 0,
                type:
                    asset.mimeType ||
                    (name.toLowerCase().endsWith('.pdf')
                        ? 'application/pdf'
                        : 'image/jpeg'),
            };

            if (file.size > MAX_FILE_BYTES) {
                Alert.alert(
                    'Archivo muy grande',
                    'El tamaño máximo permitido es 5 MB.'
                );
                return;
            }

            if (type === 'cedula') setCedula(file);
            else setHierro(file);
        } catch {
            Alert.alert('Error', 'No se pudo seleccionar el archivo.');
        }
    };

    const shareFarmLocation = async () => {
        setShowLocationPicker(true);
    };

    const handleLocationSelect = (location: { lat: number; lng: number; address?: string }) => {
        setFarmLocation(location);
        setShowLocationPicker(false);
    };

    const closeLocationPicker = () => {
        setShowLocationPicker(false);
    };

    // ── Fetch existing application ───────────────────────────────────────────
    const fetchApplication = async () => {
        try {
            const response = await api.get('/seller-applications/me');
            if (
                response.status >= 200 &&
                response.status < 300 &&
                response.data?.success
            ) {
                setApplication(response.data.data);
            }
        } catch (error) {
            // 404 is expected when no application exists — swallow silently
            logger.info('No active application found', { error });
        } finally {
            setLoadingApplication(false);
        }
    };

    // ── Submit ───────────────────────────────────────────────────────────────
    const submitApplication = async () => {
        if (!cedula || !hierro) {
            Alert.alert('Error', 'Debes subir tanto la cédula como el hierro.');
            return;
        }

        const trimmedReason = reason.trim();
        if (trimmedReason && trimmedReason.length < 20) {
            Alert.alert(
                'Aviso',
                'Tu mensaje es muy corto. Describe mejor tu experiencia, la ubicación y qué necesitas para que podamos revisar la solicitud con mayor claridad.'
            );
            return;
        }

        setLoading(true);
        try {
            const toBlob = async (uri: string) => {
                const resp = await fetch(uri);
                return resp.blob();
            };

            const formData = new FormData();
            formData.append('documents', await toBlob(cedula.uri), cedula.name);
            formData.append('documents', await toBlob(hierro.uri), hierro.name);
            if (reason.trim()) formData.append('reason', reason.trim());
            if (farmLocation.lat !== undefined && farmLocation.lng !== undefined) {
                formData.append('farmLocationLat', farmLocation.lat.toString());
                formData.append('farmLocationLng', farmLocation.lng.toString());
            }
            if (farmLocation.address) {
                formData.append('farmLocationAddress', farmLocation.address);
            }

            const response = await api.post('/seller-applications', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (
                response.status >= 200 &&
                response.status < 300 &&
                response.data?.success
            ) {
                Toast.show({
                    type: 'success',
                    text1: 'Solicitud enviada',
                    text2: 'Tu solicitud ha sido enviada exitosamente.',
                });
                await fetchApplication();
            } else {
                throw new Error(
                    response.data?.message || 'Error al enviar la solicitud'
                );
            }
        } catch (error: any) {
            const msg =
                error.response?.data?.message ||
                error.message ||
                'Error desconocido';
            Alert.alert('Error', `No se pudo enviar la solicitud: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplication();
    }, []);

    return {
        reason,
        setReason,
        cedula,
        hierro,
        loading,
        application,
        loadingApplication,
        farmLocation,
        showLocationPicker,
        pickDocument,
        shareFarmLocation,
        handleLocationSelect,
        closeLocationPicker,
        submitApplication,
    };
};
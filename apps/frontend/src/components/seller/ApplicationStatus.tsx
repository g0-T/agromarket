// File: frontend/src/components/seller/ApplicationStatus.tsx
// Component for application status.

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration SellerApplication.
interface SellerApplication {
    id: string;
    status: 'pending' | 'approved' | 'rejected' | 'blocked_from_applying';
    reason?: string;
    adminNotes?: string;
    submittedAt: string;
    reviewedAt?: string;
}

interface ApplicationStatusProps {
    application: SellerApplication | null;
    loadingApplication: boolean;
    colors: any;
    styles: any;
}

// Component for status_map.
const STATUS_MAP: Record<
    string,
    { icon: string; colorKey: 'warning' | 'success' | 'error' | 'mutedText'; text: string }
> = {
    pending: {
        icon: 'schedule',
        colorKey: 'warning',
        text: 'Tu solicitud está pendiente de revisión',
    },
    approved: {
        icon: 'check-circle',
        colorKey: 'success',
        text: '¡Felicitaciones! Tu solicitud fue aprobada',
    },
    rejected: {
        icon: 'cancel',
        colorKey: 'error',
        text: 'Tu solicitud fue rechazada',
    },
    blocked_from_applying: {
        icon: 'block',
        colorKey: 'error',
        text: 'No puedes enviar solicitudes en este momento',
    },
};

// Exported constant ApplicationStatus.
export const ApplicationStatus: React.FC<ApplicationStatusProps> = ({
    application,
    loadingApplication,
    colors,
    styles,
}) => {
    if (loadingApplication) {
        return (
            <View style={styles.statusContainer}>
                <View style={styles.statusLoadingRow}>
                    <ActivityIndicator size="small" color={colors.brand} />
                    <Text style={styles.statusText}>
                        Cargando estado de solicitud…
                    </Text>
                </View>
            </View>
        );
    }

    if (!application) {
        return null; 
    }

    const info = STATUS_MAP[application.status] ?? {
        icon: 'info',
        colorKey: 'mutedText' as const,
        text: 'Estado desconocido',
    };
    const accentColor = colors[info.colorKey];

    return (
        <View
            style={[
                styles.statusContainer,
                {
                    borderLeftWidth: 4,
                    borderLeftColor: accentColor,
                },
            ]}
        >
            <View style={styles.statusRow}>
                <MaterialIcons
                    name={info.icon as any}
                    size={22}
                    color={accentColor}
                />
                <Text style={[styles.statusText, { color: accentColor }]}>
                    {info.text}
                </Text>
            </View>

            {application.adminNotes ? (
                <Text style={styles.adminNotes}>
                    {application.adminNotes}
                </Text>
            ) : null}

            <Text style={styles.submittedAt}>
                Enviado:{' '}
                {new Date(application.submittedAt).toLocaleDateString('es', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                })}
            </Text>
            {application.reviewedAt ? (
                <Text style={styles.reviewedAt}>
                    Revisado:{' '}
                    {new Date(application.reviewedAt).toLocaleDateString('es', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}
                </Text>
            ) : null}
        </View>
    );
};

// File: frontend/src/components/seller/DocumentUpload.tsx
// Component for document upload.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration DocumentFile.
interface DocumentFile {
    name: string;
    uri: string;
    size: number;
    type: string;
}

interface DocumentUploadProps {
    cedula: DocumentFile | null;
    hierro: DocumentFile | null;
    farmLocation: {
        lat?: number;
        lng?: number;
        address?: string;
    };
    onPickDocument: (type: 'cedula' | 'hierro') => void;
    onShareLocation: () => void;
    colors: any;
    styles: any;
    responsiveRowStyle: object;
    responsiveLabelStyle: object;
}

// Exported constant DocumentUpload.
export const DocumentUpload: React.FC<DocumentUploadProps> = ({
    cedula,
    hierro,
    farmLocation,
    onPickDocument,
    onShareLocation,
    colors,
    styles,
    responsiveRowStyle,
    responsiveLabelStyle,
}) => {
    const renderField = (
        label: string,
        document: DocumentFile | null,
        type: 'cedula' | 'hierro'
    ) => (
        <View key={type} style={[styles.row, responsiveRowStyle]}>
            <Text style={[styles.label, responsiveLabelStyle]}>{label}</Text>

            <View style={[styles.inputContainer, { minWidth: 0 }]}>
                {document ? (
                    <View style={styles.documentPreview}>
                        <MaterialIcons
                            name="description"
                            size={20}
                            color={colors.success}
                            style={{ flexShrink: 0 }}
                        />
                        <Text
                            style={styles.documentName}
                            numberOfLines={1}
                            ellipsizeMode="middle"
                        >
                            {document.name}
                        </Text>
                        <TouchableOpacity
                            onPress={() => onPickDocument(type)}
                            style={styles.changeButton}
                            activeOpacity={0.75}
                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                            <Text style={styles.changeButtonText}>Cambiar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => onPickDocument(type)}
                        style={styles.uploadButton}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons
                            name="upload-file"
                            size={20}
                            color={colors.brand}
                        />
                        <Text style={styles.uploadButtonText}>
                            Seleccionar archivo
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const locationAvailable = farmLocation.lat !== undefined && farmLocation.lng !== undefined;
    const locationLabel = locationAvailable
        ? `Lat: ${farmLocation.lat?.toFixed(4)}, Lng: ${farmLocation.lng?.toFixed(4)}`
        : 'Aún no has compartido la ubicación de tu finca.';

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documentos Requeridos</Text>
            <Text style={styles.sectionDescription}>
                Para convertirte en vendedor, necesitas proporcionar los
                siguientes documentos y, si deseas, compartir la ubicación de
                tu finca.
            </Text>

            {renderField('Cédula', cedula, 'cedula')}
            {renderField('Hierro', hierro, 'hierro')}

            <View style={styles.locationCard}>
                <View style={styles.locationInfo}>
                    <Text style={styles.locationLabel}>Ubicación de la finca</Text>
                    <Text style={styles.locationText}>{locationLabel}</Text>
                    {farmLocation.address ? (
                        <Text style={styles.locationAddress}>{farmLocation.address}</Text>
                    ) : null}
                </View>
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={onShareLocation}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="location-pin" size={20} color="#fff" />
                    <Text style={styles.locationButtonText}>
                        {locationAvailable ? 'Actualizar' : 'Compartir'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.documentsNote}>
                <MaterialIcons
                    name="info-outline"
                    size={16}
                    color={colors.brand}
                    style={{ flexShrink: 0, marginTop: 1 }}
                />
                <Text style={styles.documentsNoteText}>
                    Formatos aceptados: PDF, JPG, PNG. Tamaño máximo: 5 MB por
                    archivo.
                </Text>
            </View>
        </View>
    );
};

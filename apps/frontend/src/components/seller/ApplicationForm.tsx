// File: frontend/src/components/seller/ApplicationForm.tsx
// Form component for application form.

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { InputField } from '@/components/ui/InputField';

// Type declaration ApplicationFormProps.
interface ApplicationFormProps {
    reason: string;
    setReason: (reason: string) => void;
    loading: boolean;
    onSubmit: () => void;
    canSubmit: boolean;
    colors: any;
    styles: any;
    responsiveRowStyle: object;
    responsiveLabelStyle: object;
}

// Form component for application input collection.
export const ApplicationForm: React.FC<ApplicationFormProps> = ({
    reason,
    setReason,
    loading,
    onSubmit,
    canSubmit,
    colors,
    styles,
    responsiveRowStyle,
    responsiveLabelStyle,
}) => {
    const isDisabled = !canSubmit || loading;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Adicional</Text>
            <Text style={styles.sectionDescription}>
                Cuéntanos por qué quieres convertirte en vendedor (opcional):
            </Text>

            <View style={[styles.row, responsiveRowStyle]}>
                <Text style={[styles.label, responsiveLabelStyle]}>
                    Motivo
                </Text>
                <View style={[styles.inputContainer, { minWidth: 0 }]}>
                    <InputField
                        placeholder="Describe tu experiencia o motivación…"
                        value={reason}
                        onChangeText={setReason}
                        multiline
                        numberOfLines={4}
                        style={styles.textArea}
                    />
                </View>
            </View>

            <TouchableOpacity
                onPress={onSubmit}
                disabled={isDisabled}
                activeOpacity={0.85}
                style={[
                    styles.submitButton,
                    isDisabled && styles.submitButtonDisabled,
                ]}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text
                        style={[
                            styles.submitButtonText,
                            isDisabled && styles.submitButtonTextDisabled,
                        ]}
                    >
                        Enviar Solicitud
                    </Text>
                )}
            </TouchableOpacity>

            {!canSubmit && (
                <Text style={styles.submitNote}>
                    Sube ambos documentos para poder enviar la solicitud.
                </Text>
            )}
        </View>
    );
};

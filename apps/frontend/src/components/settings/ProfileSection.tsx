// File: frontend/src/components/settings/ProfileSection.tsx
// Section component for profile section.

import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { InputField } from '@/components/ui/InputField';

// Type declaration ProfileSectionProps.
interface ProfileSectionProps {
    formData: {
        name: string;
        email: string;
        phone: string;
    };
    onUpdateFormData: (field: string, value: string) => void;
    colors: any;
    styles: any;
    responsiveRowStyle: object;
    responsiveLabelStyle: object;
}

// Component for fields.
const FIELDS: {
    key: 'name' | 'email';
    icon: string;
    label: string;
    placeholder: string;
    keyboardType?: any;
    autoCapitalize?: any;
}[] = [
        {
            key: 'name',
            icon: 'person',
            label: 'Nombre',
            placeholder: 'Tu nombre completo',
        },
        {
            key: 'email',
            icon: 'email',
            label: 'Email',
            placeholder: 'tu@email.com',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
        },
    ];

// Exported constant ProfileSection.
export const ProfileSection: React.FC<ProfileSectionProps> = ({
    formData,
    onUpdateFormData,
    colors,
    styles,
    responsiveRowStyle,
    responsiveLabelStyle,
}) => {
    // Avatar initial from name or email
    const initial = (formData.name || formData.email || '?')
        .trim()
        .charAt(0)
        .toUpperCase();

    return (
        <>
            <View style={styles.avatarCard}>
                <View style={styles.avatarRing}>
                    <Text style={styles.avatarInitial}>{initial}</Text>
                </View>
                {formData.name ? (
                    <Text style={styles.avatarName}>{formData.name}</Text>
                ) : null}
                {formData.email ? (
                    <Text style={styles.avatarEmail}>{formData.email}</Text>
                ) : null}
            </View>

            <View style={styles.sectionGroup}>
                <Text style={styles.sectionLabel}>Información Básica</Text>
                <View style={styles.formCard}>
                    {FIELDS.map((field, index) => (
                        <View
                            key={field.key}
                            style={[
                                styles.formRow,
                                responsiveRowStyle,
                                index > 0 && styles.formRowBorder,
                            ]}
                        >
                            <View style={[styles.formLabelWrap, responsiveLabelStyle]}>
                                <View style={styles.formIconWrap}>
                                    <MaterialIcons
                                        name={field.icon as any}
                                        size={18}
                                        color={colors.brand}
                                    />
                                </View>
                                <Text style={styles.formLabel}>{field.label}</Text>
                            </View>

                            <View style={[styles.inputContainer, { minWidth: 0 }]}>
                                <InputField
                                    value={formData[field.key]}
                                    onChangeText={field.key === 'name' || field.key === 'email'
                                        ? undefined
                                        : (v) => onUpdateFormData(field.key, v)
                                    }
                                    placeholder={field.placeholder}
                                    keyboardType={field.keyboardType}
                                    autoCapitalize={
                                        field.autoCapitalize ?? 'words'
                                    }
                                    containerStyle={{ marginBottom: 0 }}
                                    editable={!(field.key === 'name' || field.key === 'email')}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </>
    );
};

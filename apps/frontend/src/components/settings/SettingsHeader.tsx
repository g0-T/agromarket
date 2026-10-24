// File: frontend/src/components/settings/SettingsHeader.tsx
// Header component for settings header.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration SettingsHeaderProps.
interface SettingsHeaderProps {
    colors: any;
    styles: any;
    onBack: () => void;
}

// Header component for settings section.
export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
    colors,
    styles,
    onBack,
}) => {
    return (
        <View style={[styles.header, { flexDirection: 'row', alignItems: 'center' }]}>
            <TouchableOpacity
                onPress={onBack}
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: colors.cardColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                }}
                activeOpacity={0.8}
            >
                <MaterialIcons name="arrow-back-ios" size={18} color={colors.textColor} style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Configuración</Text>
                <Text style={styles.headerSubtitle}>Personaliza tu experiencia</Text>
            </View>
        </View>
    );
};

// File: frontend/src/components/settings/HelpHeader.tsx
// Header component for help header.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration HelpHeaderProps.
interface HelpHeaderProps {
    colors: any;
    styles: any;
    onBack: () => void;
}

// Header component for help section.
export const HelpHeader: React.FC<HelpHeaderProps> = ({
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
                <Text style={styles.headerTitle}>Centro de Ayuda</Text>
                <Text style={styles.headerSubtitle}>Encuentra respuestas rápidas a tus preguntas</Text>
            </View>
        </View>
    );
};

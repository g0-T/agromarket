// File: frontend/src/components/lots/LotDescription.tsx
// Component for lot description.

import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration LotDescriptionProps.
interface LotDescriptionProps {
    text?: string;
    colors: any;
    isDesktop: boolean;
}

// Component for lot description.
const LotDescription: React.FC<LotDescriptionProps> = ({ text, colors, isDesktop }) => {
    if (!text) return null;

    return (
        <View style={{
            backgroundColor: colors.cardColor,
            borderRadius: isDesktop ? 24 : 20,
            padding: isDesktop ? 24 : 16,
            borderWidth: 1,
            borderColor: colors.mutedText + '18',
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <MaterialIcons name="description" size={18} color={colors.brand} />
                <Text style={{ color: colors.textColor, fontSize: isDesktop ? 17 : 15, fontWeight: '800' }}>
                    Descripción
                </Text>
            </View>
            <Text style={{ color: colors.mutedText, fontSize: isDesktop ? 16 : 14, lineHeight: isDesktop ? 26 : 22 }}>
                {text}
            </Text>
        </View>
    );
};

// Default export for this module.
export default LotDescription;

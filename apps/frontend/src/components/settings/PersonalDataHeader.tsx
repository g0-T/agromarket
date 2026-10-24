// File: frontend/src/components/settings/PersonalDataHeader.tsx
// Header component for personal data header.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration PersonalDataHeaderProps.
interface PersonalDataHeaderProps {
    colors: any;
    styles: any;
    onBack: () => void;
    isDesktop?: boolean;
}

// Header component for personalData section.
export const PersonalDataHeader: React.FC<PersonalDataHeaderProps> = ({
    colors,
    styles,
    onBack,
    isDesktop = false,
}) => {
    return (
        <View
            style={[
                styles.header,
                { flexDirection: 'row', alignItems: 'center' },
                {
                    paddingTop: isDesktop ? 28 : 16,
                    paddingHorizontal: isDesktop ? 40 : 20,
                },
            ]}
        >
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
                <MaterialIcons
                    name="arrow-back-ios"
                    size={18}
                    color={colors.textColor}
                    style={{ marginLeft: 4 }}
                />
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Datos Personales</Text>
                <Text style={styles.headerSubtitle}>Personaliza tu experiencia</Text>
            </View>
        </View>
    );
};

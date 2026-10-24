// File: frontend/src/components/settings/FavoritesHeader.tsx
// Header component for favorites header.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Type declaration FavoritesHeaderProps.
interface FavoritesHeaderProps {
    colors: any;
    styles: any;
    onBack: () => void;
}

// Header component for favorites section.
export const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({
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
                <Text style={styles.headerTitle}>Mis Favoritos</Text>
                <Text style={styles.headerSubtitle}>Tus lotes guardados</Text>
            </View>

            <View style={{ marginLeft: 15 }}>
                <Ionicons name="heart" size={26} color={colors.brand} />
            </View>
        </View>
    );
};

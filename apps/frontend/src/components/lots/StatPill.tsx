// File: frontend/src/components/lots/StatPill.tsx
// Component for stat pill.

import React from 'react';
import { View, Text } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getThemeColors } from '@/constants/theme';

// Type declaration ThemeColors.
type ThemeColors = ReturnType<typeof getThemeColors>;

// Component for stat pill.
const StatPill = ({
    iconName, iconType, label, value, colors,
}: {
    iconName: string; iconType: string; label: string; value: string; colors: ThemeColors;
}) => {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 980;

    const IconComponent = iconType === 'MaterialIcons' ? MaterialIcons : MaterialCommunityIcons;

    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.cardColor,
            borderRadius: isDesktop ? 20 : 16,
            paddingVertical: isDesktop ? 20 : 14,
            paddingHorizontal: isDesktop ? 16 : 10,
            alignItems: 'center',
            gap: isDesktop ? 10 : 6,
            borderWidth: 1,
            borderColor: colors.brand + '22',
        }}>
            <IconComponent name={iconName as any} size={isDesktop ? 26 : 20} color={colors.brand} />
            <Text style={{ color: colors.brand, fontSize: isDesktop ? 20 : 16, fontWeight: '800' }}>{value}</Text>
            <Text style={{ color: colors.mutedText, fontSize: isDesktop ? 13 : 11, fontWeight: '500', textAlign: 'center' }}>{label}</Text>
        </View>
    );
};

// Default export for this module.
export default StatPill;

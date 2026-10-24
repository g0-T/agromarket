// File: frontend/src/components/lots/InfoRow.tsx
// Component for info row.

import React from 'react';
import { View, Text } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getThemeColors } from '@/constants/theme';

// Type declaration ThemeColors.
type ThemeColors = ReturnType<typeof getThemeColors>;

// Component for info row.
const InfoRow = ({
    icon, label, value, colors, last = false,
}: {
    icon: string; label: string; value: string; colors: ThemeColors; last?: boolean;
}) => {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 980;

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: isDesktop ? 18 : 13,
            borderBottomWidth: last ? 0 : 1,
            borderColor: colors.mutedText + '20',
            gap: isDesktop ? 16 : 12,
        }}>
            <View style={{
                width: isDesktop ? 44 : 36, height: isDesktop ? 44 : 36, borderRadius: isDesktop ? 12 : 10,
                backgroundColor: colors.brand + '15',
                alignItems: 'center', justifyContent: 'center',
            }}>
                <MaterialIcons name={icon as any} size={isDesktop ? 22 : 18} color={colors.brand} />
            </View>
            <Text style={{ flex: 1, color: colors.mutedText, fontSize: isDesktop ? 15 : 13, fontWeight: '500' }}>{label}</Text>
            <Text style={{ color: colors.textColor, fontSize: isDesktop ? 16 : 14, fontWeight: '700' }}>{value}</Text>
        </View>
    );
};

// Default export for this module.
export default InfoRow;

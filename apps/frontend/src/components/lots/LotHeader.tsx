// File: frontend/src/components/lots/LotHeader.tsx
// Header component for lot header.

import React from 'react';
import { Animated, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration LotHeaderProps.
interface LotHeaderProps {
    opacity: any;
    title: string;
    colors: any;
    insets: { top: number };
    headerPaddingX: number;
    onBack: () => void;
}

// Component for lot header.
const LotHeader: React.FC<LotHeaderProps> = ({ opacity, title, colors, insets, headerPaddingX, onBack }) => (
    <Animated.View pointerEvents="box-none" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        opacity,
        backgroundColor: colors.backgroundColor,
        paddingTop: insets.top,
        paddingHorizontal: headerPaddingX,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: colors.mutedText + '25',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    }}>
        <TouchableOpacity
            onPress={onBack}
            style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: colors.cardColor,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <MaterialIcons name="arrow-back-ios" size={16} color={colors.textColor} style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        <Text style={{ flex: 1, color: colors.textColor, fontSize: 15, fontWeight: '800' }} numberOfLines={1}>
            {title}
        </Text>
    </Animated.View>
);

// Default export for this module.
export default LotHeader;

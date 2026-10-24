// File: frontend/src/components/settings/SettingsDangerRow.tsx
// Component for settings danger row.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration SettingsDangerRowProps.
interface SettingsDangerRowProps {
    label: string;
    onPress: () => void;
    colors: any;
    styles: any;
}

// Exported constant SettingsDangerRow.
export const SettingsDangerRow: React.FC<SettingsDangerRowProps> = ({
    label,
    onPress,
    colors,
    styles,
}) => {
    return (
        <TouchableOpacity style={styles.dangerRow} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.settingsIconWrap}>
                <MaterialIcons name="logout" size={18} color="#ef4444" />
            </View>
            <Text style={styles.dangerText}>{label}</Text>
            <MaterialIcons name="chevron-right" size={18} color={colors.mutedText || '#6b7280'} />
        </TouchableOpacity>
    );
};

// File: frontend/src/components/settings/SettingsToggleRow.tsx
// Component for settings toggle row.

import React from 'react';
import { View, Text, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration SettingsToggleRowProps.
interface SettingsToggleRowProps {
    icon: string;
    label: string;
    value: boolean;
    onToggle: () => void;
    colors: any;
    styles: any;
}

// Exported constant SettingsToggleRow.
export const SettingsToggleRow: React.FC<SettingsToggleRowProps> = ({
    icon,
    label,
    value,
    onToggle,
    colors,
    styles,
}) => {
    return (
        <View style={styles.settingsRow}>
            <View style={styles.settingsIconWrap}>
                <MaterialIcons name={icon as any} size={18} color={colors.brand} />
            </View>
            <Text style={styles.settingsLabel}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: colors.mutedText, true: colors.brand }}
                thumbColor="#fff"
                style={styles.toggle}
            />
        </View>
    );
};

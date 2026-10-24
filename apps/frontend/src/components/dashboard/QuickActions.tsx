
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardView } from '@/store/use-dashboard.store';

interface QuickActionsProps {
    setView: (view: DashboardView) => void;
    colors: any;
    styles: any;
}

const QuickActions: React.FC<QuickActionsProps> = ({ setView, colors, styles }) => (
    <View style={styles.menuCard}>
        <Text style={styles.menuSectionLabel}>Cuenta</Text>
        {[
            { icon: 'person-outline' as const, label: 'Datos personales', color: colors.textColor, onPress: () => setView('personal_data') },
            { icon: 'settings-outline' as const, label: 'Configuración', color: colors.textColor, onPress: () => setView('settings') },
            { icon: 'bookmark-outline' as const, label: 'Favoritos', color: colors.textColor, onPress: () => setView('favorites') },
            { icon: 'help-circle-outline' as const, label: 'Ayuda y soporte', color: colors.textColor, onPress: () => setView('help') },
        ].map((item, idx, arr) => (
            <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, idx < arr.length - 1 && styles.menuItemBorder]}
                activeOpacity={0.7}
                onPress={item.onPress}
            >
                <Ionicons name={item.icon} size={20} color={item.color} />
                <Text style={[styles.menuItemText, { color: item.color }]}>{item.label}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

export default QuickActions;

// File: frontend/src/components/transactions/EmptyState.tsx
// Component for empty state.

import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration EmptyStateProps.
interface EmptyStateProps {
    activeTab: 'sales' | 'purchases';
    styles: any;
    colors: any;
}

// Exported constant EmptyState.
export const EmptyState: React.FC<EmptyStateProps> = ({ activeTab, styles, colors }) => (
    <View style={styles.emptyState}>
        <View style={styles.emptyStateIcon}>
            <MaterialIcons name="inventory" size={32} color={colors.brand} />
        </View>
        <Text style={styles.emptyTitle}>No hay transacciones para mostrar</Text>
        <Text style={styles.emptySubtitle}>
            {activeTab === 'sales'
                ? 'Aún no tienes ventas. Publica un lote y comienza a recibir pedidos.'
                : 'Aún no tienes compras. Explora el mercado y encuentra tu próximo lote.'}
        </Text>
    </View>
);

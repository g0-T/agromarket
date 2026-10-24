// File: frontend/src/components/market/ResultsBar.tsx
// Component for results bar.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Type declaration ResultsBarProps.
interface ResultsBarProps {
    loading: boolean;
    error: string | null;
    filteredDataLength: number;
    hasActiveFilters: boolean;
    colors: any;
    styles: any;
    handleResetFilters: () => void;
}

// Exported constant ResultsBar.
export const ResultsBar: React.FC<ResultsBarProps> = ({
    loading,
    error,
    filteredDataLength,
    hasActiveFilters,
    colors,
    styles,
    handleResetFilters,
}) => (
    <View style={styles.resultsBar}>
        {loading ? (
            <Text style={styles.resultsCount}>Cargando productos...</Text>
        ) : error ? (
            <Text style={[styles.resultsCount, { color: colors.error }]}>{error}</Text>
        ) : (
            <Text style={styles.resultsCount}>
                <Text style={{ color: colors.brand, fontWeight: '800' }}>{filteredDataLength}</Text>
                {' '}lotes disponibles
            </Text>
        )}
    </View>
);

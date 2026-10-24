// File: frontend/src/components/market/PaginationControls.tsx
// Component for pagination controls.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration PaginationControlsProps.
interface PaginationControlsProps {
    page: number;
    totalPages: number;
    hasMore: boolean;
    loading: boolean;
    limit: number;
    totalCount: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handleSetLimit: (l: number) => void;
    colors: any;
    styles: any;
}

// Exported constant PaginationControls.
export const PaginationControls: React.FC<PaginationControlsProps> = ({
    page,
    totalPages,
    hasMore,
    loading,
    limit,
    totalCount,
    handlePrevPage,
    handleNextPage,
    handleSetLimit,
    colors,
    styles,
}) => {
    if (totalCount <= 1 || totalPages === 1) {
        return (
            <View style={{ alignItems: 'center', margin: 16 }}>
                <Text style={{ color: colors.textColor, fontWeight: '600' }}>Página 1</Text>
            </View>
        );
    }

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 12,
            backgroundColor: colors.cardColor,
            borderRadius: 8,
            margin: 16
        }}>
            <TouchableOpacity
                onPress={handlePrevPage}
                disabled={page === 1 || loading}
                style={{ padding: 10 }}
            >
                <MaterialIcons
                    name="chevron-left"
                    size={24}
                    color={page === 1 ? colors.mutedText : colors.brand}
                />
            </TouchableOpacity>

            <Text style={{ color: colors.textColor, fontWeight: '600', marginHorizontal: 8 }}>
                Pág. {page} de {totalPages}
            </Text>

            <TouchableOpacity
                onPress={handleNextPage}
                disabled={page === totalPages || loading || totalPages === 1}
                style={{ padding: 10 }}
            >
                <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={page === totalPages || totalPages === 1 ? colors.mutedText : colors.brand}
                />
            </TouchableOpacity>

            <View style={{ width: 1, height: 20, backgroundColor: colors.borderColor, marginHorizontal: 10 }} />

            {[10, 20, 50].filter(l => l < totalCount || l === limit).map(l => (
                <TouchableOpacity
                    key={l}
                    onPress={() => handleSetLimit(l)}
                    style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        backgroundColor: limit === l ? colors.brand : 'transparent',
                        borderRadius: 4,
                        marginHorizontal: 2
                    }}
                >
                    <Text style={{
                        color: limit === l ? '#fff' : colors.mutedText,
                        fontSize: 12,
                        fontWeight: 'bold'
                    }}>{l}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

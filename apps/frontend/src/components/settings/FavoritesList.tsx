// File: frontend/src/components/settings/FavoritesList.tsx
// List component for favorites list.

import React from 'react';
import { View, Text, FlatList, ActivityIndicator, useWindowDimensions } from 'react-native';
import { ProductCard } from '@/components/ui/ProductCard';

// Type declaration FavoritesListProps.
interface FavoritesListProps {
    favorites: any[];
    loading: boolean;
    colors: any;
    styles: any;
}

// UI list component for favorites items.
export const FavoritesList: React.FC<FavoritesListProps> = ({
    favorites,
    loading,
    colors,
    styles,
}) => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    if (loading) {
        return (
            <View style={{ marginHorizontal: 20, marginTop: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.brand} />
            </View>
        );
    }

    if (favorites.length === 0) {
        return (
            <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <Text style={{ color: colors.mutedText, textAlign: 'center' }}>
                    Aún no has guardado ningún lote.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={favorites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={{ marginBottom: 16, paddingHorizontal: isDesktop ? 0 : 20 }}>
                    <ProductCard item={item} />
                </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        />
    );
};

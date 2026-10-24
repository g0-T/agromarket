// File: frontend/src/screens/dashboard/FavoritesScreen.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { View, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useFavorites } from '@/hooks/settings/use-favorites';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { FavoritesHeader } from '@/components/settings/FavoritesHeader';
import { FavoritesList } from '@/components/settings/FavoritesList';

interface FavoritesScreenProps {
    onBack: () => void;
}

// Default React component export.
export default function FavoritesScreen({ onBack }: FavoritesScreenProps) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const {
        favorites,
        loading,
        isReady,
        colors,
        styles,
        handleGoBack,
    } = useFavorites(onBack);

    if (!isReady) {
        return (
            <DashboardShell isDesktop={isDesktop} styles={styles}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.brand} />
                </View>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell isDesktop={isDesktop} styles={styles}>
            <FavoritesHeader
                colors={colors}
                styles={styles}
                onBack={handleGoBack}
            />

            <FavoritesList
                favorites={favorites}
                loading={loading}
                colors={colors}
                styles={styles}
            />
        </DashboardShell>
    );
}
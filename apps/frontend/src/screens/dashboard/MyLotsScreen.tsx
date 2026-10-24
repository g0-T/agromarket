// File: frontend/src/screens/dashboard/MyLotsScreen.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useMyLots } from '@/hooks/dashboard/use-my-lots';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { MyLotsHeader } from '@/components/dashboard/MyLotsHeader';
import { MyLotCard } from '@/components/dashboard/MyLotCard';

// Default React component export.
export default function MyLotsScreen() {
    const {
        products,
        loading,
        isReady,
        user,
        colors,
        styles,
    } = useMyLots();

    if (!isReady || !user) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <DashboardShell isDesktop={false} styles={styles}>
            <MyLotsHeader colors={colors} styles={styles} />

            <View style={{ padding: 20, flex: 1 }}>
                {loading ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <ActivityIndicator size="large" color={colors.brand} />
                    </View>
                ) : products.length === 0 ? (
                    <Text>No tienes lotes publicados aún.</Text>
                ) : (
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ marginBottom: 16 }}>
                                <MyLotCard lot={item} colors={colors} styles={styles} />
                            </View>
                        )}
                    />
                )}
            </View>
        </DashboardShell>
    );
}

// File: frontend/src/components/lots/LotStatus.tsx
// Component for lot status.

import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Exported constant LotLoading.
export const LotLoading = ({ colors }: any) => (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
        <MaterialCommunityIcons name="cow" size={44} color={colors.brand} />
        <Text style={{ color: colors.mutedText, marginTop: 12, fontWeight: '600' }}>Cargando lote...</Text>
    </SafeAreaView>
);

// Exported constant LotNotFound.
export const LotNotFound = ({ colors, onBack }: any) => (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <MaterialIcons name="search-off" size={52} color={colors.mutedText} />
        <Text style={{ color: colors.textColor, fontSize: 18, fontWeight: '800' }}>Lote no encontrado</Text>
        <TouchableOpacity onPress={onBack} style={{ backgroundColor: colors.brand, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Volver al mercado</Text>
        </TouchableOpacity>
    </SafeAreaView>
);

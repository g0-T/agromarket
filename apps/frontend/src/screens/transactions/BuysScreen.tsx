// File: frontend/src/screens/transactions/BuysScreen.tsx
// Screen component defining a top-level app view.

import React, { useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getStyles } from '@/styles/screens/dashboard/dashboard.styles';

// Default React component export.
export default function TransactionsBuysRedirect() {
    const router = useRouter();
    const { colors, styles } = useTheme(getStyles);

    useEffect(() => {
        router.replace('/transactions');
    }, [router]);

    return (
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={colors.brand} />
            <Text style={{ color: colors.mutedText, marginTop: 12 }}>Redirigiendo a transacciones...</Text>
        </SafeAreaView>
    );
}

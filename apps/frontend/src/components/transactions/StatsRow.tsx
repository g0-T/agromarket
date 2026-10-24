// File: frontend/src/components/transactions/StatsRow.tsx
// Component for stats row.

import React from 'react';
import { View, Text } from 'react-native';
import { Transaction } from '@/utils/transaction-helpers';

// Type declaration StatsRowProps.
interface StatsRowProps {
    activeTab: 'sales' | 'purchases';
    mySales: Transaction[];
    myPurchases: Transaction[];
    activePurchases: Transaction[];
    styles: any;
}

// Exported constant StatsRow.
export const StatsRow: React.FC<StatsRowProps> = ({ activeTab, mySales, myPurchases, activePurchases, styles }) => (
    <View style={styles.statsRow}>
        {activeTab === 'sales' ? (
            <>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Publicaciones</Text>
                    <Text style={styles.statValue}>{mySales.length}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Pagadas</Text>
                    <Text style={styles.statValue}>{mySales.filter(s => s.status === 'paid').length}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Completadas</Text>
                    <Text style={styles.statValue}>{mySales.filter(s => s.status === 'completed').length}</Text>
                </View>
            </>
        ) : (
            <>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Activas</Text>
                    <Text style={styles.statValue}>{activePurchases.length}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Pagadas</Text>
                    <Text style={styles.statValue}>{myPurchases.filter(p => p.status === 'paid').length}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Recibidas</Text>
                    <Text style={styles.statValue}>{myPurchases.filter(p => p.status === 'completed').length}</Text>
                </View>
            </>
        )}
    </View>
);

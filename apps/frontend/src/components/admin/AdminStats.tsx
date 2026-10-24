// File: frontend/src/components/admin/AdminStats.tsx
// Component for admin stats.

import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Type declaration AdminStatsProps.
interface AdminStatsProps {
    stats: any;
    colors: any;
    styles: any;
}

// Component for admin stats.
const AdminStats: React.FC<AdminStatsProps> = ({ stats, colors, styles }) => {
    const sections = [
        {
            title: 'Solicitudes',
            items: [
                { label: 'Totales', value: stats.totalApplications, icon: 'assignment' },
                { label: 'Pendientes', value: stats.pendingApplications, icon: 'schedule' },
            ],
        },
        {
            title: 'Transacciones',
            items: [
                { label: 'Totales', value: stats.totalTransactions, icon: 'swap-horiz' },
                { label: 'Completadas', value: stats.completedTransactions, icon: 'done-all' },
                { label: 'Disputas', value: stats.totalDisputes || 0, icon: 'report-problem' },
            ],
        },
    ];

    return (
        <View style={styles.statsGroups}>
            {sections.map((section, index) => (
                <View key={index} style={styles.statsGroup}>
                    <Text style={styles.statsGroupTitle}>{section.title}</Text>
                    <View style={styles.statsGroupGrid}>
                        {section.items.map((item, itemIndex) => (
                            <View key={itemIndex} style={styles.statCard}>
                                <MaterialIcons name={item.icon as any} size={24} color={colors.brand} />
                                <Text style={styles.statValue}>{item.value}</Text>
                                <Text style={styles.statLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
};

// Default export for this module.
export default AdminStats;

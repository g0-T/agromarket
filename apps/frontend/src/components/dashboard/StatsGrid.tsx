
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface QuickStat {
    label: string;
    value: string | number;
    icon: string;
    trend?: string;
    trendUp?: boolean;
}

interface StatsGridProps {
    quickStats: QuickStat[];
    colors: any;
    styles: any;
}

const RatingStars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
            <MaterialIcons
                key={i}
                name={i <= Math.floor(rating) ? 'star' : i - rating < 1 ? 'star-half' : 'star-border'}
                size={size}
                color="#C5A059"
            />
        ))}
    </View>
);

const StatsGrid: React.FC<StatsGridProps> = ({ quickStats, colors, styles }) => (
    <View style={styles.statsGrid}>
        {quickStats.map(stat => (
            <View key={stat.label} style={styles.statCard}>
                <View style={styles.statIconWrap}>
                    <MaterialIcons name={stat.icon as any} size={18} color={colors.brand} />
                </View>
                <Text style={styles.statValue}>
                    {stat.label === 'Valoración' ? String(stat.value) : stat.value}
                </Text>
                {stat.label === 'Valoración' && (
                    <RatingStars rating={Number(stat.value)} size={11} />
                )}
                <Text style={styles.statLabel}>{stat.label}</Text>
                {stat.trend && (
                    <Text style={[styles.statTrend, { color: stat.trendUp ? colors.success : colors.mutedText }]}>
                        {stat.trendUp ? '↑' : ''} {stat.trend}
                    </Text>
                )}
            </View>
        ))}
    </View>
);

export default StatsGrid;

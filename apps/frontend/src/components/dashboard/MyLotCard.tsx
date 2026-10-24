
import React from 'react';
import { View, Text } from 'react-native';
import { LotItem } from '@/hooks/dashboard/use-my-lots';

interface MyLotCardProps {
    lot: LotItem;
    colors: any;
    styles: any;
}

export const MyLotCard: React.FC<MyLotCardProps> = ({ lot, colors, styles }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{lot.title}</Text>
            <Text style={styles.cardSubtitle}>{lot.description}</Text>
        </View>
    );
};

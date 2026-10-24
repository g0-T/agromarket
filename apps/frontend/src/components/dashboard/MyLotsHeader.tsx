
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MyLotsHeaderProps {
    colors: any;
    styles: any;
}

export const MyLotsHeader: React.FC<MyLotsHeaderProps> = ({ colors, styles }) => {
    return (
        <View style={[styles.header, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <View>
                <Text style={styles.headerTitle}>Mis Lotes</Text>
                <Text style={styles.headerSubtitle}>Administra tus publicaciones activas</Text>
            </View>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
                <MaterialIcons name="add" size={22} color={colors.white} />
            </TouchableOpacity>
        </View>
    );
};

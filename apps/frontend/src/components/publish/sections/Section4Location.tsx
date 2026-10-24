// File: frontend/src/components/publish/sections/Section4Location.tsx
// Section component for section 4 location.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import SectionCard from '@/components/publish/SectionCard';
import { FILTERS } from '@/constants/filters';

// Type declaration Section4LocationProps.
interface Section4LocationProps {
    styles: any;
    colors: any;
    isDesktop: boolean;
    formData: any;
    openPicker: (field: string, title: string, options: string[]) => void;
}

// Exported constant Section4Location.
export const Section4Location: React.FC<Section4LocationProps> = ({
    styles,
    colors,
    isDesktop,
    formData,
    openPicker,
}) => (
    <SectionCard styles={styles} style={isDesktop ? styles.fullWidthCard : styles.multimediaCard}>
        <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color={colors.brand} />
            <Text style={styles.sectionTitle}>4. Localización de la Finca</Text>
        </View>

        <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => openPicker('location', 'Seleccionar Estado', FILTERS.LOCATIONS)}
            activeOpacity={0.7}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="location-on" size={18} color={colors.brand} />
                <Text style={styles.pickerText}>{formData.location || 'Seleccionar ubicación'}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={22} color={colors.brand} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapPlaceholder} activeOpacity={0.8}>
            <View style={{ alignItems: 'center', gap: 10 }}>
                <MaterialCommunityIcons name="map" size={48} color={colors.brand + '40'} />
                <Text style={{ color: colors.mutedText, fontSize: 14, textAlign: 'center' }}>
                    Seleccionar ubicación en el mapa
                </Text>
                <Text style={{ color: colors.brand, fontSize: 12, fontWeight: '600' }}>
                    Próximamente
                </Text>
            </View>
        </TouchableOpacity>
    </SectionCard>
);

// File: frontend/src/components/publish/sections/Section2Info.tsx
// Section component for section 2 info.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SectionCard from '@/components/publish/SectionCard';
import { InputField } from '@/components/ui/InputField';
import { FILTERS } from '@/constants/filters';

// Type declaration Section2InfoProps.
interface Section2InfoProps {
    styles: any;
    colors: any;
    isDesktop: boolean;
    formData: any;
    update: (key: string, value: string) => void;
    openPicker: (field: string, title: string, options: string[]) => void;
}

// Exported constant Section2Info.
export const Section2Info: React.FC<Section2InfoProps> = ({
    styles,
    colors,
    isDesktop,
    formData,
    update,
    openPicker,
}) => (
    <SectionCard styles={styles} style={isDesktop ? {} : styles.multimediaCard}>
        <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information-outline" size={20} color={colors.brand} />
            <Text style={styles.sectionTitle}>2. Información General</Text>
        </View>

        <Text style={styles.label}>Título de la publicación</Text>
        <InputField
            style={styles.input}
            placeholder="Ej: 40 Becerros Brahman en excelente estado..."
            value={formData.title}
            onChangeText={(v: string) => update('title', v)}
        />

        <Text style={[styles.label, { marginTop: 14 }]}>Descripción (opcional)</Text>
        <InputField
            style={[styles.input, { height: 90, textAlignVertical: 'top', paddingTop: 12 }]}
            placeholder="Describe el estado de los animales, alimentación, manejo sanitario..."
            value={formData.description}
            onChangeText={(v: string) => update('description', v)}
            multiline
        />

        <View style={[styles.row, { marginTop: 14 }]}>
            <View style={styles.flex1}>
                <Text style={styles.label}>Tipo</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => openPicker('type', 'Seleccionar Tipo', FILTERS.TYPES)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.pickerText}>{formData.type || 'Seleccionar'}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.brand} />
                </TouchableOpacity>
            </View>
            <View style={styles.flex1}>
                <Text style={styles.label}>Categoría</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => openPicker('category', 'Categoría', FILTERS.CATEGORIES)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.pickerText}>{formData.category || 'Seleccionar'}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.brand} />
                </TouchableOpacity>
            </View>
        </View>
    </SectionCard>
);

// File: frontend/src/components/publish/sections/Section3Breed.tsx
// Section component for section 3 breed.

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SectionCard from '@/components/publish/SectionCard';
import { InputField } from '@/components/ui/InputField';
import { FILTERS } from '@/constants/filters';

// Type declaration Section3BreedProps.
interface Section3BreedProps {
    styles: any;
    colors: any;
    isDesktop: boolean;
    formData: any;
    update: (key: string, value: string) => void;
    updateNumber: (key: string, value: string, allowDecimals?: boolean) => void;
    openPicker: (field: string, title: string, options: string[]) => void;
}

// Exported constant Section3Breed.
export const Section3Breed: React.FC<Section3BreedProps> = ({
    styles,
    colors,
    isDesktop,
    formData,
    update,
    updateNumber,
    openPicker,
}) => (
    <SectionCard styles={styles} style={isDesktop ? {} : styles.multimediaCard}>
        <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cow" size={20} color={colors.brand} />
            <Text style={styles.sectionTitle}>3. Raza y Conteo</Text>
        </View>

        <View style={styles.row}>
            <View style={styles.flex1}>
                <Text style={styles.label}>Grupo</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => openPicker('breedGroup', 'Seleccionar Grupo', Object.keys(FILTERS.BREEDS))}
                    activeOpacity={0.7}
                >
                    <Text style={styles.pickerText}>{formData.breedGroup || 'Seleccionar'}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.brand} />
                </TouchableOpacity>
            </View>
            <View style={styles.flex1}>
                <Text style={styles.label}>Raza</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => openPicker('breed', 'Seleccionar Raza', FILTERS.BREEDS[formData.breedGroup as keyof typeof FILTERS.BREEDS] || [])}
                    activeOpacity={0.7}
                >
                    <Text style={styles.pickerText}>{formData.breed || 'Seleccionar'}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.brand} />
                </TouchableOpacity>
            </View>
        </View>

        <View style={[styles.row, { marginTop: 14 }]}>
            <View style={styles.flex1}>
                <Text style={styles.label}>Cabezas</Text>
                <InputField
                    style={[styles.input, { textAlign: 'center' }]}
                    keyboardType="numeric"
                    placeholder="0"
                    value={formData.heads}
                    onChangeText={(v: string) => updateNumber('heads', v)}
                />
            </View>
            <View style={[styles.flex1, { minWidth: 0 }]}>
                <Text style={styles.label}>Peso promedio (kg)</Text>
                <InputField
                    style={[styles.input, { textAlign: 'center', width: '100%', minWidth: 0 }]}
                    keyboardType="numeric"
                    placeholder="0"
                    value={formData.weight}
                    onChangeText={(v: string) => updateNumber('weight', v, true)}
                    wrapperStyle={{ flex: 1, backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0, minWidth: 0 }}
                    containerStyle={{ marginBottom: 0, flex: 1, minWidth: 0 }}
                />
            </View>
        </View>
        <View style={[styles.row, { marginTop: 14 }]}>
            <View style={styles.flex1}>
                <Text style={styles.label}>Edad</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => openPicker('age', 'Seleccionar Edad', FILTERS.AGES)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.pickerText}>{formData.age || 'Seleccionar'}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.brand} />
                </TouchableOpacity>
            </View>
            <View style={styles.flex1}>
                <Text style={styles.label}>Condición</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => openPicker('condition', 'Seleccionar Condición', FILTERS.CONDITIONS)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.pickerText}>{formData.condition || 'Seleccionar'}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.brand} />
                </TouchableOpacity>
            </View>
        </View>
    </SectionCard>
);

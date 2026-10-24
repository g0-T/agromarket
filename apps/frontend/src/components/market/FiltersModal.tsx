// File: frontend/src/components/market/FiltersModal.tsx
// Modal component for filters modal.

import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FILTERS } from '@/constants/filters';

// Type declaration BreedGroup.
type BreedGroup = 'Cebú' | 'Lecheras' | null;

interface FiltersModalProps {
    isVisible: boolean;
    onClose: () => void;
    selectedCategory: string | null;
    onSelectCategory: (c: string | null) => void;
    selectedLocation: string | null;
    onSelectLocation: (l: string | null) => void;
    selectedBreed: string | null;
    onSelectBreed: (b: string | null) => void;
    mainBreedGroup: BreedGroup;
    setMainBreedGroup: (g: BreedGroup) => void;
    onReset: () => void;
    hasActiveFilters: boolean;
    filteredDataLength: number;
    colors: any;
    styles: any;
    isDesktop?: boolean;
    selectedType?: string;
    onSelectType?: (t: string) => void;
}

// Modal component for filters interactions.
export const FiltersModal: React.FC<FiltersModalProps> = ({
    isVisible,
    onClose,
    selectedCategory,
    onSelectCategory,
    selectedLocation,
    onSelectLocation,
    selectedBreed,
    onSelectBreed,
    mainBreedGroup,
    setMainBreedGroup,
    onReset,
    hasActiveFilters,
    filteredDataLength,
    colors,
    styles,
    isDesktop = false,
    selectedType,
    onSelectType,
}) => {
    if (isDesktop) {
        return (
            <View style={styles.desktopSidebar}>
                <View style={styles.desktopSidebarHeader}>
                    <Text style={styles.desktopSidebarTitle}>Filtros</Text>
                    {hasActiveFilters && (
                        <TouchableOpacity onPress={onReset}>
                            <Text style={styles.desktopSidebarReset}>Limpiar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 24, padding: 16 }}>
                    <View>
                        <Text style={styles.desktopFilterLabel}>Categoría</Text>
                        <View style={styles.wrapContainer}>
                            {FILTERS.CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.chip, selectedCategory === cat && styles.activeChip]}
                                    onPress={() => onSelectCategory(selectedCategory === cat ? null : cat)}
                                >
                                    <Text style={{ color: selectedCategory === cat ? colors.brand : colors.mutedText, fontSize: 12 }}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View>
                        <Text style={styles.desktopFilterLabel}>Raza</Text>
                        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10, marginTop: 8 }}>
                            {(Object.keys(FILTERS.BREEDS) as BreedGroup[]).filter(Boolean).map((g) => (
                                <TouchableOpacity
                                    key={g!}
                                    style={[styles.groupBtn, mainBreedGroup === g && styles.activeGroup]}
                                    onPress={() => { setMainBreedGroup(mainBreedGroup === g ? null : g); onSelectBreed(null); }}
                                >
                                    <Text style={{ color: mainBreedGroup === g ? colors.brand : colors.mutedText, fontSize: 13, fontWeight: '600' }}>
                                        {g}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {mainBreedGroup && (
                            <View style={styles.wrapContainer}>
                                {FILTERS.BREEDS[mainBreedGroup as keyof typeof FILTERS.BREEDS].map((breed) => (
                                    <TouchableOpacity
                                        key={breed}
                                        onPress={() => onSelectBreed(selectedBreed === breed ? null : breed)}
                                        style={[styles.breedChip, selectedBreed === breed && { backgroundColor: colors.brand }]}
                                    >
                                        <Text style={{ color: selectedBreed === breed ? '#fff' : colors.brand, fontSize: 12 }}>
                                            {breed}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View>
                        <Text style={styles.desktopFilterLabel}>Estado / Ubicación</Text>
                        <View style={styles.wrapContainer}>
                            {FILTERS.LOCATIONS.map(loc => (
                                <TouchableOpacity
                                    key={loc}
                                    style={[styles.chip, selectedLocation === loc && styles.activeChip]}
                                    onPress={() => onSelectLocation(selectedLocation === loc ? null : loc)}
                                >
                                    <Text style={{ color: selectedLocation === loc ? colors.brand : colors.mutedText, fontSize: 12 }}>
                                        {loc}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <Modal visible={isVisible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <View>
                            <Text style={styles.modalTitle}>Filtros Avanzados</Text>
                            {hasActiveFilters && (
                                <TouchableOpacity onPress={onReset} style={{ marginTop: 4 }}>
                                    <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 13 }}>Limpiar todos</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                            <MaterialIcons name="close" size={24} color={colors.textColor} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingBottom: 20, gap: 20 }}>
                            <View>
                                <Text style={styles.sectionTitle}>Categoría</Text>
                                <View style={styles.wrapContainer}>
                                    {FILTERS.CATEGORIES.map(cat => (
                                        <TouchableOpacity
                                            key={cat}
                                            onPress={() => onSelectCategory(selectedCategory === cat ? null : cat)}
                                            style={[styles.chip, selectedCategory === cat && styles.activeChip]}
                                        >
                                            <Text style={{ color: selectedCategory === cat ? colors.brand : colors.mutedText }}>
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View>
                                <Text style={styles.sectionTitle}>Raza</Text>
                                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                                    {(Object.keys(FILTERS.BREEDS) as BreedGroup[]).filter(Boolean).map(g => (
                                        <TouchableOpacity
                                            key={g!}
                                            onPress={() => { setMainBreedGroup(mainBreedGroup === g ? null : g); onSelectBreed(null); }}
                                            style={[styles.groupBtn, mainBreedGroup === g && styles.activeGroup]}
                                        >
                                            <Text style={{ color: mainBreedGroup === g ? colors.brand : colors.mutedText }}>{g}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                {mainBreedGroup && (
                                    <View style={styles.wrapContainer}>
                                        {FILTERS.BREEDS[mainBreedGroup as keyof typeof FILTERS.BREEDS].map(breed => (
                                            <TouchableOpacity
                                                key={breed}
                                                onPress={() => onSelectBreed(selectedBreed === breed ? null : breed)}
                                                style={[styles.breedChip, selectedBreed === breed && { backgroundColor: colors.brand }]}
                                            >
                                                <Text style={{ color: selectedBreed === breed ? '#fff' : colors.brand }}>{breed}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                            <View>
                                <Text style={styles.sectionTitle}>Ubicación</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                    {FILTERS.LOCATIONS.map(loc => (
                                        <TouchableOpacity
                                            key={loc}
                                            onPress={() => onSelectLocation(selectedLocation === loc ? null : loc)}
                                            style={[styles.chip, selectedLocation === loc && styles.activeChip]}
                                        >
                                            <Text style={{ color: selectedLocation === loc ? colors.brand : colors.mutedText }}>
                                                {loc}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                        <Text style={styles.applyButtonText}>
                            Ver {filteredDataLength} resultados
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

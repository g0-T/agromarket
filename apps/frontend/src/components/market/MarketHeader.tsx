// File: frontend/src/components/market/MarketHeader.tsx
// Header component for market header.

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { InputField } from '@/components/ui/InputField';
import { FILTERS } from '@/constants/filters';

// Type declaration MarketHeaderProps.
interface MarketHeaderProps {
    isDesktop: boolean;
    colors: any;
    styles: any;
    bcvRate: number;
    searchText: string;
    setSearchText: (text: string) => void;
    handleSearchChange: (text: string) => void;
    selectedType: string;
    applyFilter: (filterType: 'main' | 'advanced', key: string, value: any) => void;
    hasActiveFilters: boolean;
    setIsModalVisible: (visible: boolean) => void;
}

// Header component for market section.
export const MarketHeader: React.FC<MarketHeaderProps> = ({
    isDesktop,
    colors,
    styles,
    bcvRate,
    searchText,
    setSearchText,
    handleSearchChange,
    selectedType,
    applyFilter,
    hasActiveFilters,
    setIsModalVisible,
}) => {
    // Logo Header
    const LogoHeader = useCallback(() => (
        <View style={[styles.headerRow, {
            backgroundColor: colors.backgroundColor,
            paddingVertical: isDesktop ? 14 : 8,
        }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.logoIconWrap, { width: isDesktop ? 44 : 36, height: isDesktop ? 44 : 36, borderRadius: isDesktop ? 13 : 10 }]}>
                    <MaterialIcons name="agriculture" size={isDesktop ? 26 : 20} color="#fff" />
                </View>
                <View>
                    <Text style={[styles.title, { fontSize: isDesktop ? 22 : 18 }]}>AgroMarket</Text>
                    <Text style={styles.rate}>1$ = {Number(bcvRate).toFixed(2)} Bs. · BCV</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="notifications" size={isDesktop ? 22 : 20} color={colors.brand} />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>
        </View>
    ), [isDesktop, colors, styles, bcvRate]);

    // Search Bar
    const SearchBar = useCallback(() => (
        <View style={[styles.searchBlurWrap, { backgroundColor: colors.backgroundColor }]}>
            <View style={[styles.searchRow, { paddingHorizontal: 16 }]}>
                <View style={styles.searchBar}>
                    <MaterialIcons name="search" size={20} color={colors.mutedText} style={{ marginLeft: 4 }} />
                    <InputField
                        style={{ flex: 1, color: colors.textColor, fontSize: 15, minWidth: 0, marginLeft: 8 }}
                        placeholder="Buscar ganado, raza, categoría..."
                        value={searchText}
                        onChangeText={handleSearchChange}
                        returnKeyType="search"
                        wrapperStyle={{ flex: 1, backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0, minWidth: 0 }}
                        containerStyle={{ marginBottom: 0, flex: 1, minWidth: 0 }}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <MaterialIcons name="close" size={18} color={colors.mutedText} />
                        </TouchableOpacity>
                    )}
                </View>
                {!isDesktop && (
                    <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalVisible(true)}>
                        <MaterialIcons name="tune" size={22} color="#fff" />
                        {hasActiveFilters && <View style={styles.filterActiveDot} />}
                    </TouchableOpacity>
                )}
            </View>

            {/* Type chips row */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, gap: 8 }}
            >
                {FILTERS.TYPES.map(type => {
                    const isSelected = selectedType === type;
                    return (
                        <TouchableOpacity
                            key={type}
                            onPress={() => applyFilter('main', 'type', type)}
                            disabled={isSelected}
                            style={[
                                styles.typeButton,
                                isSelected && { backgroundColor: colors.brand, borderColor: colors.brand },
                            ]}
                            activeOpacity={isSelected ? 1 : 0.7}
                        >
                            <Text style={{ color: isSelected ? '#fff' : colors.mutedText, fontWeight: '600', fontSize: 13 }}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    ), [searchText, selectedType, hasActiveFilters, colors, styles, isDesktop, applyFilter, setSearchText, handleSearchChange, setIsModalVisible]);

    if (isDesktop) {
        return <SearchBar />;
    }

    return (
        <>
            <LogoHeader />
            <SearchBar />
        </>
    );
};

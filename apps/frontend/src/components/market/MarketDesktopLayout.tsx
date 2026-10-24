// File: frontend/src/components/market/MarketDesktopLayout.tsx
// Component for market desktop layout.

import React, { useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ProductCard } from '@/components/market/ProductCard';
import { FiltersModal } from '@/components/market/FiltersModal';
import { MarketHeader } from '@/components/market/MarketHeader';
import { ResultsBar } from '@/components/market/ResultsBar';
import { PaginationControls } from '@/components/market/PaginationControls';

// Type declaration MarketDesktopLayoutProps.
interface MarketDesktopLayoutProps {
    colors: any;
    styles: any;
    bcvRate: number;
    searchText: string;
    setSearchText: (text: string) => void;
    handleSearchChange: (text: string) => void;
    selectedType: string;
    applyFilter: (type: 'main' | 'advanced', key: string, value: any) => void;
    hasActiveFilters: boolean;
    setIsModalVisible: (visible: boolean) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    selectedLocation: string | null;
    setSelectedLocation: (location: string | null) => void;
    selectedBreed: string | null;
    setSelectedBreed: (breed: string | null) => void;
    mainBreedGroup: 'Cebú' | 'Lecheras' | null;
    setMainBreedGroup: (group: 'Cebú' | 'Lecheras' | null) => void;
    handleResetFilters: () => void;
    filteredData: any[];
    loading: boolean;
    error: string | null;
    filterKey: number;
    offeredIds: number[];
    page: number;
    hasMore: boolean;
    limit: number;
    totalCount: number;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handleSetLimit: (limit: number) => void;
}

// Layout component that structures page sections.
export const MarketDesktopLayout: React.FC<MarketDesktopLayoutProps> = ({
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
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    selectedBreed,
    setSelectedBreed,
    mainBreedGroup,
    setMainBreedGroup,
    handleResetFilters,
    filteredData,
    loading,
    error,
    filterKey,
    offeredIds,
    page,
    hasMore,
    limit,
    totalCount,
    handlePrevPage,
    handleNextPage,
    handleSetLimit,
}) => {
    const totalPagesCalc = Math.max(1, Math.ceil(totalCount / limit));
    const renderDesktopItem = useCallback(({ item, index }: { item: any; index: number }) => (
        <ProductCard key={`${filterKey}-${item.id}`} item={item} index={index} offeredIds={offeredIds} isDesktop />
    ), [filterKey, offeredIds]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={{ maxWidth: 1440, alignSelf: 'center', width: '100%' }}>
                <MarketHeader
                    isDesktop={true}
                    colors={colors}
                    styles={styles}
                    bcvRate={bcvRate}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    handleSearchChange={handleSearchChange}
                    selectedType={selectedType}
                    applyFilter={applyFilter}
                    hasActiveFilters={hasActiveFilters}
                    setIsModalVisible={setIsModalVisible}
                />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', maxWidth: 1440, alignSelf: 'center', width: '100%' }}>
                <FiltersModal
                    isVisible={false}
                    onClose={() => { }}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    selectedLocation={selectedLocation}
                    onSelectLocation={setSelectedLocation}
                    selectedBreed={selectedBreed}
                    onSelectBreed={setSelectedBreed}
                    mainBreedGroup={mainBreedGroup}
                    setMainBreedGroup={setMainBreedGroup}
                    onReset={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                    filteredDataLength={filteredData.length}
                    colors={colors}
                    styles={styles}
                    isDesktop={true}
                    selectedType={selectedType}
                    onSelectType={(t) => applyFilter('main', 'type', t)}
                />
                <View style={{ flex: 1 }}>
                    <ResultsBar
                        loading={loading}
                        error={error}
                        filteredDataLength={filteredData.length}
                        hasActiveFilters={hasActiveFilters}
                        colors={colors}
                        styles={styles}
                        handleResetFilters={handleResetFilters}
                    />
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderDesktopItem}
                        key={`desktop-3-${filterKey}`}
                        numColumns={3}
                        columnWrapperStyle={{ gap: 16, paddingHorizontal: 16 }}
                        contentContainerStyle={{ paddingBottom: 80, paddingTop: 4 }}
                        initialNumToRender={9}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={6}
                        updateCellsBatchingPeriod={100}
                        windowSize={5}
                        getItemLayout={(data, index) => ({
                            length: 355,
                            offset: 355 * index,
                            index,
                        })}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <MaterialIcons name="search-off" size={48} color={colors.mutedText} />
                                <Text style={styles.emptyText}>No se encontraron resultados.</Text>
                                <TouchableOpacity onPress={handleResetFilters} style={styles.emptyReset}>
                                    <Text style={{ color: colors.brand, fontWeight: '700' }}>Limpiar filtros</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                    <PaginationControls
                        page={page}
                        totalPages={totalPagesCalc}
                        hasMore={hasMore}
                        loading={loading}
                        limit={limit}
                        totalCount={totalCount}
                        handlePrevPage={handlePrevPage}
                        handleNextPage={handleNextPage}
                        handleSetLimit={handleSetLimit}
                        colors={colors}
                        styles={styles}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

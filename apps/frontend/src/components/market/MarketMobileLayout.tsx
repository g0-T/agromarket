// File: frontend/src/components/market/MarketMobileLayout.tsx
// Component for market mobile layout.

import React, { useCallback } from 'react';
import { View, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ProductCard } from '@/components/market/ProductCard';
import { FiltersModal } from '@/components/market/FiltersModal';
import { MarketHeader } from '@/components/market/MarketHeader';
import { PaginationControls } from '@/components/market/PaginationControls';

// Type declaration MarketMobileLayoutProps.
interface MarketMobileLayoutProps {
    colors: any;
    styles: any;
    bcvRate: number;
    searchText: string;
    setSearchText: (text: string) => void;
    handleSearchChange: (text: string) => void;
    selectedType: string;
    applyFilter: (type: 'main' | 'advanced', key: string, value: any) => void;
    hasActiveFilters: boolean;
    isModalVisible: boolean;
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
export const MarketMobileLayout: React.FC<MarketMobileLayoutProps> = ({
    colors,
    styles,
    bcvRate,
    searchText,
    setSearchText,
    handleSearchChange,
    selectedType,
    applyFilter,
    hasActiveFilters,
    isModalVisible,
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
    const renderMobileItem = useCallback(({ item, index }: { item: any; index: number }) => (
        <ProductCard key={`${filterKey}-${item.id}`} item={item} index={index} offeredIds={offeredIds} />
    ), [filterKey, offeredIds]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMobileItem}
                key={`mobile-1-${filterKey}`}
                ListHeaderComponent={
                    <MarketHeader
                        isDesktop={false}
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
                }
                numColumns={1}
                contentContainerStyle={{ paddingBottom: 100 }}
                initialNumToRender={6}
                maxToRenderPerBatch={4}
                updateCellsBatchingPeriod={60}
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
                windowSize={4}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialIcons name="search-off" size={48} color={colors.mutedText} />
                        <Text style={styles.emptyText}>No se encontraron resultados.</Text>
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
            <FiltersModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                selectedCategory={selectedCategory}
                onSelectCategory={(c) => applyFilter('advanced', 'cat', c)}
                selectedLocation={selectedLocation}
                onSelectLocation={(l) => applyFilter('advanced', 'loc', l)}
                selectedBreed={selectedBreed}
                onSelectBreed={(b) => applyFilter('advanced', 'breed', b)}
                mainBreedGroup={mainBreedGroup}
                setMainBreedGroup={setMainBreedGroup}
                onReset={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
                filteredDataLength={filteredData.length}
                colors={colors}
                styles={styles}
                isDesktop={false}
            />
        </SafeAreaView>
    );
};

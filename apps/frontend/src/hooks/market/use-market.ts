// File: frontend/src/hooks/market/use-market.ts
// Custom hook logic for React state and side effects.

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '@/hooks/use-auth';
import transactionService from '@/services/transaction.service';
import productService, { Product } from '@/services/product.service';
import logger from '@/utils/logger';

// ─── Types ─────────────────────────────────────────────────────────────────────
type BreedGroup = 'Cebú' | 'Lecheras' | null;

// ─── Helpers ───────────────────────────────────────────────────────────────────
const clean = (t: string) =>
    t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/s$/, '');

// Exported constant useMarket.
export const useMarket = () => {
    const { user } = useAuth();
    const isFocused = useIsFocused();

    // Search and filters state
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('Todos');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [mainBreedGroup, setMainBreedGroup] = useState<BreedGroup>(null);
    const [selectedBreed, setSelectedBreed] = useState<string | null>(null);

    // Products and loading state
    const [products, setProducts] = useState<Product[]>([]);
    const [offeredIds, setOfferedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Animation and pagination state
    const [filterKey, setFilterKey] = useState(0);
    const isFirstRender = useRef(true);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // Pagination Handlers
    const handleNextPage = useCallback(() => {
        if (hasMore) setPage(p => p + 1);
    }, [hasMore]);

    const handlePrevPage = useCallback(() => {
        setPage(p => Math.max(1, p - 1));
    }, []);

    const handleSetLimit = useCallback((l: number) => {
        setLimit(l);
        setPage(1);
    }, []);

    // Debounced search effect
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchText);
        }, 400);
        return () => clearTimeout(t);
    }, [searchText]);

    // Fetch products effect
    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const params: any = {
                    page,
                    limit,
                    includeTotal: page === 1,
                };
                if (selectedCategory) params.category = selectedCategory;
                if (debouncedSearch) params.search = debouncedSearch;
                if (user?.id) params.excludeSellerId = user.id;
                const res = await productService.listProductsWithCount(params);
                setProducts(res.data);
                if (res.total != null) setTotalCount(res.total);
                setHasMore(res.total != null ? page < Math.ceil(res.total / limit) : res.data.length === limit);
            } catch (e: any) {
                logger.warn('fetch products failed', { error: e });
                setError('Unable to load products');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [selectedCategory, debouncedSearch, page, limit, user?.id]);

    // Load offered ids effect
    useEffect(() => {
        if (!isFocused) return;
        if (!user) {
            setOfferedIds([]);
            return;
        }
        transactionService.listUserTransactions()
            .then(txs => {
                const ids = txs
                    .map(tx => tx.product?.id)
                    .filter((id): id is number => !!id);
                setOfferedIds(ids);
            })
            .catch(err => {
                logger.error(err, { context: 'Failed to load offered product IDs', userId: user.id });
            });
    }, [user, isFocused]);

    // Search change handler
    const handleSearchChange = (text: string) => {
        setSearchText(text);
        if (text.length > 0) {
            // If user starts typing, reset advanced filters
            setSelectedCategory(null);
            setSelectedLocation(null);
            setMainBreedGroup(null);
            setSelectedBreed(null);
            setSelectedType('Todos');
            setPage(1);
        }
    };

    // Reset filters
    const handleResetFilters = useCallback(() => {
        setSearchText('');
        setSelectedType('Todos');
        setSelectedCategory(null);
        setSelectedLocation(null);
        setMainBreedGroup(null);
        setSelectedBreed(null);
        setPage(1);
        setFilterKey(k => k + 1);
    }, []);

    // Apply filter
    const applyFilter = useCallback((filterType: 'main' | 'advanced', key: string, value: any) => {
        if (filterType === 'main') {
            if (value === selectedType) return;
            handleResetFilters();
            setSelectedType(value);
        } else {
            setSelectedType('Todos');
            setSearchText('');
            if (key === 'cat') setSelectedCategory(prev => prev === value ? null : value);
            if (key === 'loc') setSelectedLocation(prev => prev === value ? null : value);
            if (key === 'breed') setSelectedBreed(prev => prev === value ? null : value);
        }
        setPage(1);
        setFilterKey(k => k + 1);
    }, [selectedType, handleResetFilters]);

    // Computed values
    const hasActiveFilters = useMemo(
        () => !!selectedCategory || !!selectedLocation || !!selectedBreed || searchText.length > 0,
        [selectedCategory, selectedLocation, selectedBreed, searchText]
    );

    const filteredData = useMemo(() => {
        const s = debouncedSearch.toLowerCase().trim();
        const tc = clean(selectedType);
        return products.filter(item => {
            if (s && !item.title.toLowerCase().includes(s)) return false;
            if (selectedType !== 'Todos' && clean(item.type || '') !== tc) return false;
            if (selectedCategory && item.category !== selectedCategory) return false;
            if (selectedBreed && item.breed !== selectedBreed) return false;
            if (selectedLocation && item.location !== selectedLocation) return false;
            return true;
        });
    }, [products, debouncedSearch, selectedType, selectedCategory, selectedBreed, selectedLocation]);

    return {
        searchText,
        setSearchText,
        debouncedSearch,
        isModalVisible,
        setIsModalVisible,
        selectedType,
        setSelectedType,
        selectedCategory,
        setSelectedCategory,
        selectedLocation,
        setSelectedLocation,
        mainBreedGroup,
        setMainBreedGroup,
        selectedBreed,
        setSelectedBreed,
        products,
        offeredIds,
        loading,
        error,
        filterKey,
        page,
        limit,
        hasMore,
        totalCount,
        // Handlers
        handleNextPage,
        handlePrevPage,
        handleSetLimit,
        handleSearchChange,
        handleResetFilters,
        applyFilter,
        // Computed
        hasActiveFilters,
        filteredData,
    };
};
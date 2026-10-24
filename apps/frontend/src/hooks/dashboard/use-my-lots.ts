// File: frontend/src/hooks/dashboard/use-my-lots.ts
// Custom hook logic for React state and side effects.

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getSettingsStyles } from '@/styles/screens/dashboard/settings.styles';
import AuthContext from '@/context/AuthContext';
import logger from '@/utils/logger';

// Type declaration LotItem.
export interface LotItem {
    id: string;
    title: string;
    description: string;
}

const placeholderLots: LotItem[] = [];

// Exported constant useMyLots.
export const useMyLots = () => {
    const router = useRouter();
    const { user, isReady } = useContext(AuthContext);
    const { colors, styles } = useTheme(getSettingsStyles);
    const [products, setProducts] = useState<LotItem[]>(placeholderLots);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isReady && !user) {
            router.replace('/login');
            return;
        }

        const loadMyProducts = async () => {
            try {
                setLoading(true);
                setProducts(placeholderLots);
            } catch (error) {
                logger.error(error, { context: 'loadMyProducts' });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadMyProducts();
        }
    }, [isReady, user, router]);

    return {
        products,
        loading,
        isReady,
        user,
        colors,
        styles,
    };
};
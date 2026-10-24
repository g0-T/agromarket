// File: frontend/src/hooks/settings/use-favorites.ts
// Custom hook logic for React state and side effects.

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import favoriteService from '@/services/favorite.service';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getSettingsStyles } from '@/styles/screens/dashboard/settings.styles';
import { useRouter } from 'expo-router';
import logger from '@/utils/logger';

// Exported constant useFavorites.
export const useFavorites = (onBack: () => void) => {
    const { theme, colors, styles } = useTheme(getSettingsStyles);
    const router = useRouter();
    const { user, isReady } = useAuth();

    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isReady || !user) return;

        const loadFavorites = async () => {
            try {
                setLoading(true);
                const data = await favoriteService.listFavorites();
                setFavorites(data.map(item => item.product));
            } catch (err) {
                logger.error(err, { context: 'loadFavorites' });
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [isReady, user]);

    const handleGoBack = () => {
        onBack();
    };

    return {
        favorites,
        loading,
        isReady,
        colors,
        styles,
        handleGoBack,
    };
};
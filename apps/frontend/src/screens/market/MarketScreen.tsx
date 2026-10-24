// File: frontend/src/screens/market/MarketScreen.tsx
// Screen component defining a top-level app view.

import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getStyles } from '@/styles/screens/market/market.styles';
import { useCurrency } from '@/context/CurrencyContext';
import { useMarket } from '@/hooks/market/use-market';
import { MarketDesktopLayout } from '@/components/market/MarketDesktopLayout';
import { MarketMobileLayout } from '@/components/market/MarketMobileLayout';

const MarketScreen = () => {
    const { theme, colors, styles } = useTheme(getStyles);
    const { bcvRate } = useCurrency();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const marketData = useMarket();

    const layoutProps = {
        colors,
        styles,
        bcvRate,
        ...marketData,
    };

    if (isDesktop) {
        return <MarketDesktopLayout {...layoutProps} />;
    }

    return <MarketMobileLayout {...layoutProps} />;
};

// Default export for this module.
export default MarketScreen;

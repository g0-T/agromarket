// File: frontend/src/screens/dashboard/DashboardScreen.tsx
// Screen component defining a top-level app view.

import React, { useEffect } from 'react';
import { useDashboardStore } from '@/store/use-dashboard.store';
import PersonalDataScreen from '@/screens/dashboard/PersonalDataScreen';
import SettingsScreen from '@/screens/dashboard/SettingsScreen';
import FavoritesScreen from '@/screens/dashboard/FavoritesScreen';
import HelpScreen from '@/screens/dashboard/HelpScreen';
import BecomeSellerScreen from '@/screens/tabs/BecomeSellerScreen';
import HomeView from '@/components/dashboard/HomeView';

const DashboardScreen = () => {
    const { currentView, setView } = useDashboardStore();

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const titles: Record<string, string> = {
                home: 'AgroMarket | Usuario',
                personal_data: 'AgroMarket | Datos Personales',
                settings: 'AgroMarket | Configuracion',
                favorites: 'AgroMarket | Favoritos',
                help: 'AgroMarket | Ayuda',
                become_seller: 'AgroMarket | Vender',
            };
            document.title = titles[currentView] || 'AgroMarket | Usuario';
        }
    }, [currentView]);

    const views = {
        home: <HomeView />,
        personal_data: <PersonalDataScreen onBack={() => setView('home')} />,
        settings: <SettingsScreen onBack={() => setView('home')} />,
        favorites: <FavoritesScreen onBack={() => setView('home')} />,
        help: <HelpScreen onBack={() => setView('home')} />,
        become_seller: <BecomeSellerScreen onBack={() => setView('home')} />,
    };

    return views[currentView] || <HomeView />;
};

// Default export for this module.
export default DashboardScreen;

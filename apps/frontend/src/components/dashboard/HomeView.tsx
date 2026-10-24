
import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    ActivityIndicator
} from 'react-native';
import { useAppTheme as useTheme } from '@/hooks/use-app-theme';
import { getStyles } from '@/styles/screens/dashboard/dashboard.styles';
import { useRouter } from 'expo-router';
import AuthContext from '@/context/AuthContext';
import { useDashboardStore } from '@/store/use-dashboard.store';
import { useUserStore } from '@/store/use-user.store';
import { Product } from '@/services/product.service';
import { ProductCard } from '@/components/ui/ProductCard';
import { useDashboardData } from '@/hooks/dashboard/use-dashboard-data';
import DashboardMainSection from '@/components/dashboard/DashboardMainSection';

interface UserState {
    name: string;
    role: string;
    isSeller: boolean;
    email: string;
    joined: string;
    location: string;
    rating: number;
    totalDeals: number;
    activeListings: number;
}

interface QuickStat {
    label: string;
    value: string | number;
    icon: string;
    trend?: string;
    trendUp?: boolean;
}

const HomeView: React.FC = () => {
    const { colors, styles } = useTheme(getStyles);
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    const router = useRouter();
    const { user: authUser, signOut, isReady } = useContext(AuthContext);
    const { user: storeUser } = useUserStore();
    const sourceUser = storeUser || authUser;
    const setView = useDashboardStore(state => state.setView);
    const reset = useDashboardStore(state => state.reset);
    const [isMounted, setIsMounted] = useState(false);

    const getInitialUserState = (currentUser: typeof sourceUser | null): UserState => ({
        name: currentUser?.name || 'Usuario',
        role: currentUser?.role === 'seller' ? 'Vendedor / Comprador' : 'Comprador',
        isSeller: currentUser?.role === 'seller',
        email: currentUser?.email || '',
        joined: new Date().getFullYear().toString(),
        location: 'No especificada',
        rating: 4.8,
        totalDeals: 0,
        activeListings: 0,
    });

    const [user, setUser] = useState<UserState>(getInitialUserState(authUser));
    const { loading: loadingLots, lots, notifCount } = useDashboardData(authUser, setUser);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        if (isReady && !authUser && !storeUser) {
            router.replace('/login');
        }
    }, [isMounted, isReady, authUser, storeUser, router]);

    useEffect(() => {
        const current = sourceUser;
        if (current) {
            setUser(getInitialUserState(current));
        }
    }, [sourceUser]);

    useEffect(() => {
        if (authUser) reset();
    }, [authUser, reset]);

    const quickStats: QuickStat[] = user.isSeller
        ? [
            { label: 'Publicaciones', value: user.activeListings, icon: 'inventory' },
            { label: 'Tratos cerrados', value: user.totalDeals, icon: 'thumbs-up' },
        ]
        : [
            { label: 'Compras realizadas', value: user.totalDeals, icon: 'shopping-cart' },
            { label: 'En tránsito', value: 0, icon: 'local-shipping' },
        ];

    const renderLotItem = useCallback(({ item }: { item: Product }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/(market)/lot/${item.id}`)}
        >
            <ProductCard item={item} />
        </TouchableOpacity>
    ), [router]);

    if (!isReady || !authUser) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <ActivityIndicator size="large" color="#5ABF4E" />
                <Text style={{ color: '#fff', marginTop: 10 }}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <DashboardMainSection
            isDesktop={isDesktop}
            lots={lots}
            renderLotItem={renderLotItem}
            loadingLots={loadingLots}
            notifCount={notifCount}
            quickStats={quickStats}
            authUser={authUser}
            setView={setView}
            colors={colors}
            styles={styles}
            user={user}
        />
    );
};

export default HomeView;

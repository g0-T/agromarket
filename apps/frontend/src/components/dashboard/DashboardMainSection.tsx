
import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '@/services/product.service';
import { ListRenderItem } from 'react-native';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardProfile from '@/components/dashboard/DashboardProfile';
import StatsGrid from '@/components/dashboard/StatsGrid';
import QuickActions from '@/components/dashboard/QuickActions';
import { DashboardView } from '@/store/use-dashboard.store';

interface QuickStat {
    label: string;
    value: string | number;
    icon: string;
    trend?: string;
    trendUp?: boolean;
}

interface DashboardMainSectionProps {
    isDesktop: boolean;
    lots: Product[];
    renderLotItem: ListRenderItem<Product>;
    loadingLots: boolean;
    notifCount: number;
    quickStats: QuickStat[];
    authUser: any;
    setView: (view: DashboardView) => void;
    colors: any;
    styles: any;
    user: {
        name: string;
        email: string;
        joined: string;
        isSeller: boolean;
        role: string;
    };
}

const DashboardMainSection: React.FC<DashboardMainSectionProps> = ({
    isDesktop,
    lots,
    renderLotItem,
    loadingLots,
    notifCount,
    quickStats,
    authUser,
    setView,
    colors,
    styles,
    user,
}) => {
    if (isDesktop) {
        return (
            <SafeAreaView style={[styles.container, { flex: 1 }]} edges={['top']}>
                <View style={[styles.desktopRoot, { flex: 1 }]}>
                    <View style={[styles.desktopLeft, { height: '100%' }]}>
                        <FlatList
                            data={[]}
                            keyExtractor={() => 'left-sidebar'}
                            renderItem={() => null}
                            ListHeaderComponent={
                                <View style={{ gap: 20 }}>
                                    <DashboardProfile
                                        user={user}
                                        isCompact
                                        showSellerCta={false}
                                        onSellerPress={() => setView('become_seller')}
                                        colors={colors}
                                        styles={styles}
                                    />
                                    <QuickActions setView={setView} colors={colors} styles={styles} />
                                </View>
                            }
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ padding: 24 }}
                        />
                    </View>
                    <View style={[styles.desktopRight, { flex: 1, height: '100%' }]}>
                        <FlatList
                            data={lots}
                            keyExtractor={item => item.id.toString()}
                            renderItem={renderLotItem}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={{ padding: 24, gap: 20, flexGrow: 1 }}
                            ListHeaderComponent={
                                <View style={{ gap: 24, marginBottom: 10 }}>
                                    <DashboardHeader
                                        isDesktop
                                        userName={user.name}
                                        notifCount={notifCount}
                                        colors={colors}
                                        styles={styles}
                                    />
                                    <StatsGrid quickStats={quickStats} colors={colors} styles={styles} />
                                    <View>
                                        <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Mis Lotes Públicos</Text>
                                        {loadingLots && (
                                            <ActivityIndicator size="small" color={colors.brand} />
                                        )}
                                    </View>
                                </View>
                            }
                            ListEmptyComponent={
                                !loadingLots ? (
                                    <Text style={{ color: colors.mutedText, textAlign: 'center', marginTop: 20 }}>
                                        No hay lotes para mostrar
                                    </Text>
                                ) : null
                            }
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={lots}
                keyExtractor={item => item.id.toString()}
                renderItem={renderLotItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <View style={styles.mobilePadding}>
                        <DashboardHeader
                            isDesktop={false}
                            userName={user.name}
                            notifCount={notifCount}
                            colors={colors}
                            styles={styles}
                        />
                        <View style={{ height: 20 }} />
                        <DashboardProfile
                            user={user}
                            showSellerCta={authUser?.role === 'buyer'}
                            onSellerPress={() => setView('become_seller')}
                            colors={colors}
                            styles={styles}
                        />
                        <View style={{ height: 20 }} />
                        <StatsGrid quickStats={quickStats} colors={colors} styles={styles} />
                        <View style={{ height: 32 }} />
                        <QuickActions setView={setView} colors={colors} styles={styles} />
                        <View style={{ height: 32 }} />
                        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Mis Lotes Públicos</Text>
                        {loadingLots && (
                            <ActivityIndicator size="small" color={colors.brand} style={{ marginVertical: 20 }} />
                        )}
                    </View>
                }
                ListEmptyComponent={
                    !loadingLots ? (
                        <Text style={{ color: colors.mutedText, textAlign: 'center', marginVertical: 20 }}>
                            No tienes lotes publicados aún
                        </Text>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

export default DashboardMainSection;

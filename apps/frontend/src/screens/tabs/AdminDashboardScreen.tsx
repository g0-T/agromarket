// File: frontend/src/screens/tabs/AdminDashboardScreen.tsx
import React, { useState, useContext, useRef } from 'react';
import {
    Animated,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getAdminDashboardStyles } from '@/styles/screens/dashboard/admin-dashboard.styles';
import logger from '@/utils/logger';
import { useAppTheme } from '@/hooks/use-app-theme';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useAdminDashboardData, SellerApplication, Transaction } from '@/hooks/admin/use-admin-dashboard-data';
import AdminStats from '@/components/admin/AdminStats';
import AdminControls from '@/components/admin/AdminControls';
import ApplicationList from '@/components/admin/ApplicationList';
import TransactionList from '@/components/admin/TransactionList';
import DisputeList from '@/components/admin/DisputeList';
import ApplicationModal from '@/components/admin/ApplicationModal';
import TransactionModal from '@/components/admin/TransactionModal';
import DisputeModal from '@/components/admin/DisputeModal';
import { PaginationControls } from '@/components/market/PaginationControls';

const AdminDashboard = () => {
    const { colors } = useAppTheme();
    const styles = getAdminDashboardStyles(colors);
    const { signOut } = useContext(AuthContext);
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const {
        activeTab,
        setActiveTab,
        loading,
        searchText,
        setSearchText,
        filter,
        setFilter,
        filteredData,
        handleApprove,
        handleReject,
        handleResolveDispute,
        stats,
    } = useAdminDashboardData();

    const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
    const [showStats, setShowStats] = useState(true);
    const statsAnimation = useRef(new Animated.Value(1)).current;
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / limit));
    const paginatedData = filteredData.slice((page - 1) * limit, page * limit);
    const hasMore = page < totalPages;

    const handlePrevPage = () => setPage((current) => Math.max(1, current - 1));
    const handleNextPage = () => setPage((current) => Math.min(totalPages, current + 1));
    const handleSetLimit = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleSelectApplication = (application: SellerApplication) => setSelectedApplication(application);
    const handleSelectTransaction = (transaction: Transaction) => setSelectedTransaction(transaction);
    const handleSelectDispute = (dispute: any) => setSelectedDispute(dispute);

    React.useEffect(() => {
        setPage(1);
    }, [activeTab, searchText, filter, limit]);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/login');
        } catch (error) {
            logger.error(error, { context: 'signOut' });
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.brand} />
                    <Text style={{ color: colors.textColor, marginTop: 10 }}>Cargando datos...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Panel de Administración</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                            <MaterialIcons name="logout" size={20} color={colors.textColor} />
                            <Text style={styles.logoutText}>Salir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => {
                                const next = !showStats;
                                setShowStats(next);
                                Animated.timing(statsAnimation, {
                                    toValue: next ? 1 : 0,
                                    duration: 250,
                                    useNativeDriver: false,
                                }).start();
                            }}
                        >
                            <MaterialIcons name={showStats ? 'expand-less' : 'expand-more'} size={18} color={colors.textColor} />
                            <Text style={styles.logoutText}>{showStats ? 'Ocultar estadísticas' : 'Mostrar estadísticas'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Animated.View
                    style={[
                        isDesktop ? styles.centeredArea : undefined,
                        {
                            opacity: statsAnimation,
                            maxHeight: statsAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 600],
                            }),
                            overflow: 'hidden',
                        },
                    ]}
                >
                    <AdminStats stats={stats} colors={colors} styles={styles} />
                </Animated.View>

                <View style={isDesktop ? styles.centeredArea : undefined}>
                    <AdminControls
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        filter={filter}
                        setFilter={setFilter}
                        colors={colors}
                        styles={styles}
                    />

                    <View style={{ padding: 20 }}>
                        {!activeTab ? (
                            <View style={[styles.listItem, { justifyContent: 'center', minHeight: 180 }]}>
                                <Text style={{ color: colors.textColor, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>
                                    Selecciona Solicitudes o Transacciones para comenzar.
                                </Text>
                            </View>
                        ) : activeTab === 'applications' ? (
                            <ApplicationList
                                applications={paginatedData as SellerApplication[]}
                                onSelectApplication={handleSelectApplication}
                                colors={colors}
                                styles={styles}
                            />
                        ) : activeTab === 'transactions' ? (
                            <TransactionList
                                transactions={paginatedData as Transaction[]}
                                onSelectTransaction={handleSelectTransaction}
                                colors={colors}
                                styles={styles}
                            />
                        ) : (
                            <DisputeList
                                disputes={paginatedData as any[]}
                                onSelectDispute={handleSelectDispute}
                                colors={colors}
                                styles={styles}
                            />
                        )}
                        {activeTab && filteredData.length > 0 && (
                            <PaginationControls
                                page={page}
                                totalPages={totalPages}
                                hasMore={hasMore}
                                loading={loading}
                                limit={limit}
                                totalCount={filteredData.length}
                                handlePrevPage={handlePrevPage}
                                handleNextPage={handleNextPage}
                                handleSetLimit={handleSetLimit}
                                colors={colors}
                                styles={styles}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>

            <ApplicationModal
                visible={!!selectedApplication}
                application={selectedApplication}
                onClose={() => setSelectedApplication(null)}
                onApprove={handleApprove}
                onReject={handleReject}
                colors={colors}
                styles={styles}
            />

            <TransactionModal
                visible={!!selectedTransaction}
                transaction={selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                onResolveDispute={handleResolveDispute}
                colors={colors}
                styles={styles}
            />

            <DisputeModal
                visible={!!selectedDispute}
                dispute={selectedDispute}
                onClose={() => setSelectedDispute(null)}
                onResolve={handleResolveDispute}
                colors={colors}
                styles={styles}
            />
        </SafeAreaView>
    );
};

export default AdminDashboard;
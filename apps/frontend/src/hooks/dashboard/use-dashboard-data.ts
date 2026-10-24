// File: frontend/src/hooks/dashboard/use-dashboard-data.ts
// Custom hook logic for React state and side effects.

import { useState, useEffect } from 'react';
import { listProductsWithCount, Product } from '@/services/product.service';
import transactionService from '@/services/transaction.service';
import logger from '@/utils/logger';

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

// Exported constant useDashboardData.
export const useDashboardData = (
    authUser: any,
    onUpdateUser: (updater: (prev: UserState) => UserState) => void
) => {
    const [loading, setLoading] = useState(true);
    const [lots, setLots] = useState<Product[]>([]);
    const [notifCount, setNotifCount] = useState(0);

    const fetchData = async () => {
        if (!authUser) return;
        setLoading(true);
        try {
            const res = await listProductsWithCount();
            const userProducts = res.data.filter(p => p.sellerId === authUser.id);
            setLots(userProducts);

            const userTransactions = await transactionService.listUserTransactions();
            const closedDeals = userTransactions.filter(tx => tx.status === 'completed').length;

            onUpdateUser(prev => ({
                ...prev,
                isSeller: authUser.role === 'seller',
                activeListings: userProducts.length,
                totalDeals: closedDeals,
            }));

            setNotifCount(0);

        } catch (err) {
            logger.error(err, { context: 'fetchDashboardData' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [authUser]);

    const refreshData = () => fetchData();

    return { loading, lots, notifCount, refreshData };
};
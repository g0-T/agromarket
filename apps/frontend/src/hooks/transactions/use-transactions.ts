// File: frontend/src/hooks/transactions/use-transactions.ts
// Custom hook logic for React state and side effects.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getSocketUrl } from '@/utils/api-config';
import authService from '@/services/auth.service';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import transactionService from '@/services/transaction.service';
import { normalizeTransaction, Transaction, getTrackStep } from '@/utils/transaction-helpers';
import logger from '@/utils/logger';

// Exported constant useTransactions.
export const useTransactions = () => {
    const { user, isReady } = useAuth();
    const isSeller = user?.role === 'seller';
    const params = useLocalSearchParams();
    const requestedTab = typeof params.tab === 'string' && ['sales', 'purchases'].includes(params.tab) ? params.tab as 'sales' | 'purchases' : undefined;

    const [activeTab, setActiveTab] = useState<'sales' | 'purchases'>(requestedTab ?? (isSeller ? 'sales' : 'purchases'));
    const [selectedSaleIdx, setSelectedSaleIdx] = useState(0);
    const [selectedPurchaseIdx, setSelectedPurchaseIdx] = useState(0);
    const [desktopSubTab, setDesktopSubTab] = useState<'detail' | 'chat'>('detail');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) return;

        if (!isReady) return;

        if (!user) return;

        const loadData = async () => {
            try {
                const data = await transactionService.listUserTransactions();
                setTransactions(data.map(normalizeTransaction));
            } catch (err) {
                logger.error(err, { context: 'Failed to load user transactions', userId: user.id });
            }
        };

        loadData();
    }, [isFocused, isReady, user?.id]);

    // Real-time updates: connect to socket and listen for per-user transaction updates
    useEffect(() => {
        const token = authService.getToken();
        if (!token) return;

        const SOCKET_URL = getSocketUrl();
        const socket: Socket = io(SOCKET_URL, {
            transports: ['polling', 'websocket'],
            forceNew: true,
            autoConnect: true,
            reconnection: true,
            withCredentials: false,
            auth: { token },
            path: '/socket.io',
        });

        const handler = (payload: any) => {
            try {
                const updated = normalizeTransaction(payload);
                setTransactions(prev => prev.map(tx => tx.id === updated.id ? updated : tx));
            } catch (e) {
                // ignore malformed events
            }
        };

        socket.on('transactionUpdated', handler);

        return () => {
            try {
                socket.off('transactionUpdated', handler);
                socket.disconnect();
            } catch {
                // ignore
            }
        };
    }, [user?.id, isReady]);

    const mySales = useMemo(() => transactions.filter(t => t.sellerId === user?.id && t.product), [transactions, user]);
    const myPurchases = useMemo(() => transactions.filter(t => t.buyerId === user?.id && t.product), [transactions, user]);
    const activePurchases = myPurchases.filter(p => p.status !== 'completed');

    useEffect(() => {
        if (selectedSaleIdx >= mySales.length) setSelectedSaleIdx(0);
    }, [mySales, selectedSaleIdx]);

    useEffect(() => {
        if (selectedPurchaseIdx >= myPurchases.length) setSelectedPurchaseIdx(0);
    }, [myPurchases, selectedPurchaseIdx]);

    const handleProofUpload = useCallback(async (txId: string, file: any) => {
        const updated = await transactionService.uploadPaymentProof(txId, file);
        setTransactions(prev => prev.map(tx => tx.id === txId ? normalizeTransaction(updated) : tx));
    }, []);

    const handleConfirmReception = useCallback(async (txId: string) => {
        const updated = await transactionService.confirmTransaction(txId);
        setTransactions(prev => prev.map(tx => tx.id === txId ? normalizeTransaction(updated) : tx));
    }, []);

    const handleSendLot = useCallback(async (txId: string) => {
        const updated = await transactionService.sendLot(txId);
        setTransactions(prev => prev.map(tx => tx.id === txId ? normalizeTransaction(updated) : tx));
    }, []);

    const sendBuyerFarmLocation = useCallback(async (txId: string, location: { buyerDeliveryAddress: string; buyerDeliveryLat: string; buyerDeliveryLng: string }) => {
        const updated = await transactionService.updateDeliveryLocation(txId, location);
        setTransactions(prev => prev.map(tx => tx.id === txId ? normalizeTransaction(updated) : tx));
    }, []);

    const verifyDeliveryToken = useCallback(async (txId: string, token: string) => {
        const updated = await transactionService.verifyDeliveryToken(txId, token);
        setTransactions(prev => prev.map(tx => tx.id === txId ? normalizeTransaction(updated) : tx));
    }, []);

    const handleCreateDispute = useCallback(async (txId: string, reason: string, photos: any[] = []) => {
        await transactionService.createDispute(txId, reason, photos);
        setTransactions(prev => prev.map(tx => tx.id === txId ? {
            ...tx,
            status: 'disputed',
            currentStep: getTrackStep('disputed'),
        } : tx));
    }, []);

    return {
        user,
        isSeller,
        activeTab,
        setActiveTab,
        selectedSaleIdx,
        setSelectedSaleIdx,
        selectedPurchaseIdx,
        setSelectedPurchaseIdx,
        desktopSubTab,
        setDesktopSubTab,
        transactions,
        mySales,
        myPurchases,
        activePurchases,
        handleProofUpload,
        sendBuyerFarmLocation,
        handleConfirmReception,
        handleSendLot,
        verifyDeliveryToken,
        handleCreateDispute,
    };
};
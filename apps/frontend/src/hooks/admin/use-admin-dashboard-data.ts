// File: frontend/src/hooks/admin/use-admin-dashboard-data.ts
// Custom hook logic for React state and side effects.

import { useState, useEffect, useMemo } from 'react';
import api from '@/services/api.service';
import transactionService from '@/services/transaction.service';
import Toast from 'react-native-toast-message';

// Type declaration AttachmentFile.
export interface AttachmentFile {
    id: string;
    url: string;
    filename?: string;
    type?: 'cedula' | 'hierro' | string;
}

// Type declaration SellerApplication.
export interface SellerApplication {
    id: string;
    user: {
        name: string;
        email: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    attachments?: AttachmentFile[];
    submittedAt: string;
    reviewedAt?: string;
    adminNotes?: string;
    farmLocationLat?: number;
    farmLocationLng?: number;
    farmLocationAddress?: string;
}

// Type declaration Transaction.
export type Transaction = {
    id: string;
    product: any;
    buyerId: string;
    sellerId: string;
    buyerName?: string;
    sellerName?: string;
    buyer?: {
        id: string;
        name?: string;
        email?: string;
        phone?: string;
        image?: string;
        role?: string;
        sellerApplications?: { attachments?: { id: string; type: string; url: string; filename?: string }[] }[];
    };
    seller?: {
        id: string;
        name?: string;
        email?: string;
        phone?: string;
        image?: string;
        role?: string;
        sellerApplications?: { attachments?: { id: string; type: string; url: string; filename?: string }[] }[];
    };
    amount: number;
    currency: string;
    status: string;
    buyerProof?: string;
    buyerDeliveryAddress?: string;
    buyerDeliveryLat?: string;
    buyerDeliveryLng?: string;
    attachments?: { id: string; type: string; url: string }[];
    chatMessages: any[];
    createdAt: string;
    disputes?: any[];
};

// Type declaration Dispute.
export type Dispute = {
    id: string;
    transactionId: string;
    transaction: Transaction;
    initiatorId: string;
    initiator: {
        id: string;
        name?: string;
        email?: string;
    };
    reason: string;
    status: 'open' | 'resolved' | 'closed';
    adminNotes?: string;
    attachments?: AttachmentFile[];
    createdAt: string;
    updatedAt: string;
};

// Exported constant useAdminDashboardData.
export const useAdminDashboardData = () => {
    const [activeTab, setActiveTab] = useState<'applications' | 'transactions' | 'disputes' | null>('applications');
    const [applications, setApplications] = useState<SellerApplication[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed' | 'paid' | 'disputed' | 'open' | 'resolved' | 'closed'>('all');

    const fetchApplications = async () => {
        try {
            const response = await api.get('/seller-applications');
            setApplications(response.data.data);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudieron cargar las solicitudes.',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async () => {
        try {
            const txs = await transactionService.listAllTransactions() as Transaction[];
            const norm = txs.map((tx: Transaction) => ({
                ...tx,
                buyerName: tx.buyerName || tx.buyer?.name || '',
                sellerName: tx.sellerName || tx.seller?.name || '',
            }));
            setTransactions(norm);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudieron cargar las transacciones.',
            });
        }
    };

    const fetchDisputes = async () => {
        try {
            const disp = await transactionService.listAllDisputes();
            setDisputes(disp);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudieron cargar las disputas.',
            });
        }
    };

    const handleApprove = async (id: string, notes: string) => {
        try {
            await api.put(`/seller-applications/${id}/approve`, { notes });
            Toast.show({
                type: 'success',
                text1: 'Aprobado',
                text2: 'La solicitud ha sido aprobada.',
            });
            fetchApplications();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo aprobar.',
            });
        }
    };

    const handleReject = async (id: string, notes: string) => {
        if (!notes.trim()) {
            throw new Error('Debes ingresar una razón para rechazar.');
        }
        try {
            await api.put(`/seller-applications/${id}/reject`, { notes });
            Toast.show({
                type: 'success',
                text1: 'Rechazado',
                text2: 'La solicitud ha sido rechazada.',
            });
            fetchApplications();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo rechazar.',
            });
            throw error;
        }
    };

    const handleResolveDispute = async (id: string, status: 'resolved' | 'closed', notes?: string) => {
        try {
            await transactionService.resolveDispute(id, status, notes);
            Toast.show({
                type: 'success',
                text1: 'Disputa resuelta',
                text2: `La disputa ha sido ${status === 'resolved' ? 'resuelta' : 'cerrada'}.`,
            });
            fetchDisputes();
            fetchTransactions();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo resolver la disputa.',
            });
            throw error;
        }
    };

    const refreshData = async () => {
        setLoading(true);
        await Promise.all([fetchApplications(), fetchTransactions(), fetchDisputes()]);
        setLoading(false);
    };

    useEffect(() => {
        if (!activeTab) {
            setLoading(false);
            return;
        }
        refreshData();
    }, [activeTab]);

    const filteredData = useMemo(() => {
        let data: any[] = [];
        if (activeTab === 'applications') data = applications;
        else if (activeTab === 'transactions') data = transactions;
        else if (activeTab === 'disputes') data = disputes;

        return data.filter(item => {
            const matchesFilter = filter === 'all' || item.status === filter;
            const matchesSearch = searchText === '' || (
                activeTab === 'applications'
                    ? (item as SellerApplication).user.name.toLowerCase().includes(searchText.toLowerCase())
                    : activeTab === 'transactions'
                        ? (
                            (item as Transaction).id.slice(0, 6).toLowerCase().includes(searchText.toLowerCase()) ||
                            (item as Transaction).sellerName?.toLowerCase().includes(searchText.toLowerCase()) ||
                            (item as Transaction).buyerName?.toLowerCase().includes(searchText.toLowerCase())
                        )
                        : (
                            (item as Dispute).initiator?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                            (item as Dispute).transaction?.product?.title?.toLowerCase().includes(searchText.toLowerCase())
                        )
            );
            return matchesFilter && matchesSearch;
        });
    }, [activeTab, applications, transactions, disputes, filter, searchText]);

    const stats = useMemo(() => ({
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        approvedApplications: applications.filter(app => app.status === 'approved').length,
        rejectedApplications: applications.filter(app => app.status === 'rejected').length,
        totalTransactions: transactions.length,
        completedTransactions: transactions.filter(tx => tx.status === 'completed').length,
        pendingTransactions: transactions.filter(tx => tx.status === 'paid' || tx.status === 'pending').length,
        totalDisputes: disputes.length,
        openDisputes: disputes.filter(d => d.status === 'open').length,
        resolvedDisputes: disputes.filter(d => d.status === 'resolved').length,
    }), [applications, transactions, disputes]);

    return {
        activeTab,
        setActiveTab,
        applications,
        transactions,
        disputes,
        loading,
        searchText,
        setSearchText,
        filter,
        setFilter,
        filteredData,
        handleApprove,
        handleReject,
        handleResolveDispute,
        refreshData,
        stats,
    };
};
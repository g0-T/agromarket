// File: frontend/src/services/transaction.service.ts
// Frontend service module for API or client operations.

import { Platform } from 'react-native';
import api from '@/services/api.service';

// Type declaration TransactionPayload.
export interface TransactionPayload {
    productId: number;
    amount: number;
    currency?: string;
    buyerDeliveryAddress?: string;
    buyerDeliveryLat?: string;
    buyerDeliveryLng?: string;
}

// Type declaration TransactionSummary.
export interface TransactionSummary {
    id: string;
    product: any;
    buyerId: string;
    sellerId: string;
    buyer?: { id: string; name: string; image?: string };
    seller?: { id: string; name: string; image?: string };
    buyerName: string;
    sellerName: string;
    amount: number;
    currency: string;
    status: string;
    buyerProof?: string;
    buyerDeliveryAddress?: string;
    buyerDeliveryLat?: string;
    buyerDeliveryLng?: string;
    deliveryToken?: string;
    deliveryTokenExpiresAt?: string;
    chatMessages: any[];
    createdAt: string;
}

export async function createTransaction(data: TransactionPayload) {
    const res = await api.post<{ success: boolean; data: TransactionSummary }>('/transactions', data);
    return res.data.data;
}

export async function listUserTransactions() {
    const res = await api.get<{ success: boolean; data: TransactionSummary[] }>('/transactions');
    return res.data.data;
}

export async function listAllTransactions() {
    const res = await api.get<{ success: boolean; data: TransactionSummary[] }>('/admin/transactions');
    return res.data.data;
}

export async function getTransaction(txId: string) {
    const res = await api.get<{ success: boolean; data: TransactionSummary }>(`/transactions/${txId}`);
    return res.data.data;
}

export async function sendChatMessage(txId: string, text?: string, attachment?: any) {
    const form = new FormData();
    if (text) form.append('text', text);
    if (attachment) {
        form.append('attachment', attachment);
    }

    const res = await api.post<{ success: boolean; data: any }>(`/transactions/${txId}/chat`, form);
    return res.data.data;
}

export async function uploadPaymentProof(txId: string, file: any) {
    const form = new FormData();
    if (Platform.OS === 'web') {
        if (file.file) {
            form.append('proof', file.file);
        } else {
            const response = await fetch(file.uri);
            const blob = await response.blob();
            form.append('proof', blob, file.name || 'proof.jpg');
        }
    } else {
        form.append('proof', {
            uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
            type: file.type || 'application/octet-stream',
            name: file.name || 'proof.jpg',
        } as any);
    }

    const res = await api.post<{ success: boolean; data: TransactionSummary }>(`/transactions/${txId}/proof`, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: data => data,
    });
    return res.data.data;
}

export async function confirmTransaction(txId: string) {
    const res = await api.post<{ success: boolean; data: TransactionSummary }>(`/transactions/${txId}/complete`);
    return res.data.data;
}

export async function sendLot(txId: string) {
    const res = await api.post<{ success: boolean; data: TransactionSummary }>(`/transactions/${txId}/send-lot`);
    return res.data.data;
}

export async function updateDeliveryLocation(txId: string, data: { buyerDeliveryAddress: string; buyerDeliveryLat: string; buyerDeliveryLng: string }) {
    const res = await api.post<{ success: boolean; data: TransactionSummary }>(`/transactions/${txId}/delivery-location`, data);
    return res.data.data;
}

export async function verifyDeliveryToken(txId: string, token: string) {
    const res = await api.post<{ success: boolean; data: TransactionSummary }>(`/transactions/${txId}/verify-token`, { token });
    return res.data.data;
}

// Dispute functions
export async function createDispute(txId: string, reason: string, photos?: any[]) {
    const form = new FormData();
    form.append('transactionId', txId);
    form.append('reason', reason);

    if (photos && photos.length > 0) {
        for (const [index, photo] of photos.entries()) {
            if (Platform.OS === 'web') {
                if (photo.file) {
                    form.append('photos', photo.file);
                } else {
                    // Convert URI to Blob for web
                    const response = await fetch(photo.uri);
                    const blob = await response.blob();
                    form.append('photos', blob, photo.name || `photo-${index}.jpg`);
                }
            } else {
                form.append('photos', {
                    uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
                    type: photo.type || 'image/jpeg',
                    name: photo.name || `photo-${index}.jpg`,
                } as any);
            }
        };
    }

    const res = await api.post<{ success: boolean; data: any }>(`/transactions/${txId}/dispute`, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        transformRequest: data => data,
    });
    return res.data.data;
}

export async function listUserDisputes() {
    const res = await api.get<{ success: boolean; data: any[] }>('/transactions/disputes');
    return res.data.data;
}

// admin endpoint to retrieve all disputes (requires admin role)
export async function listAllDisputes() {
    const res = await api.get<{ success: boolean; data: any[] }>('/admin/disputes');
    return res.data.data;
}

export async function resolveDispute(disputeId: string, status: string, adminNotes?: string) {
    const res = await api.put<{ success: boolean; data: any }>(`/admin/disputes/${disputeId}/resolve`, {
        status,
        adminNotes
    });
    return res.data.data;
}

// Default export for this module.
export default { createTransaction, listUserTransactions, sendChatMessage, uploadPaymentProof, confirmTransaction, sendLot, updateDeliveryLocation, verifyDeliveryToken, listAllTransactions, getTransaction, createDispute, listUserDisputes, listAllDisputes, resolveDispute };

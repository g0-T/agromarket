// File: frontend/src/utils/transaction-helpers.ts
// Utility helper functions used across frontend code.

import { TransactionSummary } from '@/services/transaction.service';

// ─── Transaction types ────────────────────────────────────────────
export type TransactionStatus = 'pending' | 'paid' | 'in_transit' | 'completed' | 'disputed';

// ─── Chat message types ───────────────────────────────────────────
export interface ChatMessage {
    id: string;
    text?: string;
    fromMe: boolean;
    time: string;
    attachment?: string;
    transactionId?: string;
    senderId?: string;
    sender?: {
        id: string;
        name?: string;
    } | null;
    createdAt?: string;
}

// ─── Transaction data types ───────────────────────────────────────
export interface Transaction extends TransactionSummary {
    item: any;
    currentStep: number;
    location?: string;
    eta?: string;
    buyerDeliveryAddress?: string;
    buyerDeliveryLat?: string;
    buyerDeliveryLng?: string;
    deliveryToken?: string;
    deliveryTokenExpiresAt?: string;
    locationExpiresAt?: string;
}

// ─── Tracker step types ───────────────────────────────────────────
export interface StatusStep {
    key: string;
    label: string;
    icon: keyof typeof import('@expo/vector-icons').MaterialIcons.glyphMap;
}

// ─── Status step constants ────────────────────────────────────────
export const STATUS_STEPS: StatusStep[] = [
    { key: 'pending', label: 'Pendiente', icon: 'hourglass-empty' },
    { key: 'paid', label: 'Pagado', icon: 'attach-money' },
    { key: 'in_transit', label: 'En tránsito', icon: 'local-shipping' },
    { key: 'completed', label: 'Completado', icon: 'check-circle' },
    { key: 'disputed', label: 'Disputa', icon: 'report' },
];

// ─── Tracker constants ─────────────────────────────────────────────
export const TRACKER_STEPS: StatusStep[] = STATUS_STEPS.slice(0, 4);

// ─── Status badge constants ─────────────────────────────────────────
export const STATUS_BADGE: Record<TransactionStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'PENDIENTE', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    paid: { label: 'PAGADO', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    in_transit: { label: 'EN TRÁNSITO', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    completed: { label: 'COMPLETADO', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    disputed: { label: 'DISPUTA', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const TRACKER_STATUS_ORDER: TransactionStatus[] = ['pending', 'paid', 'in_transit', 'completed'];

// Map a transaction status to its tracker step index.
export function getTrackStep(status: string): number {
    if (status === 'disputed') {
        return TRACKER_STATUS_ORDER.indexOf('paid');
    }
    const index = TRACKER_STATUS_ORDER.indexOf(status as TransactionStatus);
    return index >= 0 ? index : 0;
}

// Format an order ID with an uppercase prefix.
export function formatOrderId(id: string, prefix: string) {
    if (!id) return '';
    return `${prefix.toUpperCase()}-${id.slice(0, 8)}`;
}

// Normalize an incoming API chat message into a ChatMessage object.
export function mapApiMessage(msg: any, myId?: string): ChatMessage {
    const createdAt = msg.createdAt || new Date().toISOString();
    const senderIdRaw = msg.senderId || msg.sender?.id;
    const senderId = senderIdRaw ? String(senderIdRaw) : undefined;
    const normalizedMyId = myId ? String(myId) : undefined;

    return {
        id: String(msg.id),
        text: msg.text,
        fromMe: Boolean(normalizedMyId && senderId && senderId === normalizedMyId),
        time: new Date(createdAt).toLocaleTimeString(),
        attachment: msg.attachment,
        transactionId: msg.transactionId,
        senderId,
        sender: msg.sender ? { ...msg.sender, id: msg.sender.id ? String(msg.sender.id) : senderId } : senderId ? { id: senderId } : null,
        createdAt,
    };
}


// Normalize transaction data for frontend display and status tracking.
export function normalizeTransaction(tx: any): Transaction {
    const rawStatus = (tx.status as TransactionStatus) || 'pending';
    const hasProof = Boolean(tx.buyerProof || tx.attachments?.some?.((att: any) => att?.type === 'proof'));
    const status: TransactionStatus = rawStatus === 'pending' && hasProof ? 'paid' : rawStatus;
    const currentStep = getTrackStep(status);
    const product = tx.product ?? tx.item ?? {};

    return {
        ...tx,
        status,
        currentStep,
        // Keep both `item` and `product` in sync: some components use `product`,
        // others use `item`. Ensure updated transactions don't disappear from lists.
        item: product,
        product: product,
        location: tx.buyerDeliveryAddress || tx.location || undefined,
        buyerDeliveryAddress: tx.buyerDeliveryAddress,
        buyerDeliveryLat: tx.buyerDeliveryLat,
        buyerDeliveryLng: tx.buyerDeliveryLng,
        buyerName: tx.buyerName || tx.buyer?.name || '',
        sellerName: tx.sellerName || tx.seller?.name || '',
        chatMessages: Array.isArray(tx.chatMessages)
            ? tx.chatMessages.map((msg: any) => ({
                ...msg,
                createdAt: msg.createdAt || new Date().toISOString(),
            }))
            : [],
    };
}

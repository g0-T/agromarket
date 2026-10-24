// File: frontend/src/services/notification-events.service.ts
// Frontend service module for API or client operations.

import notificationService from '@/services/notification.service';
import api from '@/services/api.service';
import logger from '@/utils/logger';

class NotificationEventsService {
    // Send notification when a new message is received
    async notifyNewMessage(transactionId: string, senderId: string, receiverId: string, message: string) {
        try {
            // Get transaction details
            const transactionResponse = await api.get(`/transactions/${transactionId}`);
            const transaction = transactionResponse.data?.data || transactionResponse.data;

            // Get sender info
            const senderResponse = await api.get(`/users/${senderId}`);
            const sender = senderResponse.data?.data || senderResponse.data;

            const title = 'Nuevo mensaje';
            const body = `${sender.name}: ${message.length > 50 ? message.substring(0, 50) + '...' : message}`;

            await notificationService.sendNotificationToUser({
                title,
                body,
                data: {
                    type: 'message',
                    transactionId,
                    senderId,
                    productId: transaction.product?.id || transaction.productId
                },
                userId: receiverId
            });
        } catch (error) {
            logger.error(error, { context: 'notifyNewMessage' });
        }
    }

    // Send notification when someone makes an offer
    async notifyNewOffer(productId: number, buyerId: string, sellerId: string, offerAmount?: number) {
        try {
            // Get product details
            const productResponse = await api.get(`/products/${productId}`);
            const product = productResponse.data?.data || productResponse.data;

            // Get buyer info
            const buyerResponse = await api.get(`/users/${buyerId}`);
            const buyer = buyerResponse.data?.data || buyerResponse.data;

            const title = 'Nueva oferta';
            const body = `${buyer.name} ha hecho una oferta por "${product.title}"${offerAmount ? ` de ${offerAmount} ${product.currency}` : ''}`;

            await notificationService.sendNotificationToUser({
                title,
                body,
                data: {
                    type: 'offer',
                    productId,
                    buyerId,
                    offerAmount
                },
                userId: sellerId
            });
        } catch (error) {
            logger.error(error, { context: 'notifyNewOffer' });
        }
    }

    // Send notification when transaction status changes
    async notifyTransactionUpdate(transactionId: string, buyerId: string, sellerId: string, status: string, productTitle: string) {
        try {
            const statusMessages = {
                'paid': 'ha sido pagada',
                'completed': 'ha sido completada',
                'disputed': 'tiene una disputa',
                'cancelled': 'ha sido cancelada'
            };

            const statusText = statusMessages[status as keyof typeof statusMessages] || 'ha sido actualizada';

            // Notify buyer
            await notificationService.sendNotificationToUser({
                title: 'Transacción actualizada',
                body: `Tu transacción de "${productTitle}" ${statusText}`,
                data: {
                    type: 'transaction',
                    transactionId,
                    status
                },
                userId: buyerId
            });

            // Notify seller
            await notificationService.sendNotificationToUser({
                title: 'Transacción actualizada',
                body: `La transacción de "${productTitle}" ${statusText}`,
                data: {
                    type: 'transaction',
                    transactionId,
                    status
                },
                userId: sellerId
            });
        } catch (error) {
            logger.error(error, { context: 'notifyTransactionUpdate' });
        }
    }

    // Send notification for product views (optional, could be batched)
    async notifyProductViews(productId: number, sellerId: string, viewCount: number) {
        try {
            // Only send if view count is significant (e.g., every 10 views)
            if (viewCount % 10 !== 0) return;

            const productResponse = await api.get(`/products/${productId}`);
            const product = productResponse.data?.data || productResponse.data;

            await notificationService.sendNotificationToUser({
                title: 'Producto popular',
                body: `Tu "${product.title}" ha recibido ${viewCount} vistas hoy`,
                data: {
                    type: 'views',
                    productId,
                    viewCount
                },
                userId: sellerId
            });
        } catch (error) {
            logger.error(error, { context: 'notifyProductViews' });
        }
    }

    // Send notification for new favorites
    async notifyNewFavorite(productId: number, sellerId: number, favoritedByUserId: string) {
        try {
            const productResponse = await api.get(`/products/${productId}`);
            const product = productResponse.data?.data || productResponse.data;

            const userResponse = await api.get(`/users/${favoritedByUserId}`);
            const user = userResponse.data?.data || userResponse.data;

            await notificationService.sendNotificationToUser({
                title: 'Producto favorito',
                body: `${user.name} agregó "${product.title}" a favoritos`,
                data: {
                    type: 'favorite',
                    productId,
                    userId: favoritedByUserId
                },
                userId: sellerId.toString()
            });
        } catch (error) {
            logger.error(error, { context: 'notifyNewFavorite' });
        }
    }
}

const notificationEventsService = new NotificationEventsService();

// Default export for this module.
export default notificationEventsService;
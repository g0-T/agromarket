// File: src/services/transaction.service.ts
// Module responsible for backend functionality.

import prisma from '@/utils/prisma.js';
import type { Prisma, PrismaClient } from '@prisma/client';

const getClient = (tx?: Prisma.TransactionClient) => tx ?? prisma;

// Service that manages transaction operations.
export const transactionService = {
    async findProduct(productId: number, tx?: Prisma.TransactionClient) {
        const client = getClient(tx);
        const product = await client.product.findUnique({
            where: { id: productId }
        });
        if (!product) throw new Error('Product not found');
        return product;
    },

    async findActiveTransaction(productId: number, buyerId: string, tx?: Prisma.TransactionClient) {
        const client = getClient(tx);
        return client.transaction.findFirst({
            where: {
                productId,
                buyerId,
                status: {
                    not: 'completed'
                }
            },
            include: {
                product: true,
                buyer: true,
                seller: true,
                attachments: true,
                chatMessages: true,
            }
        });
    },

    async checkActiveTransactions(productId: number, buyerId: string, tx?: Prisma.TransactionClient) {
        const client = getClient(tx);
        const doubleBooking = await client.transaction.findFirst({
            where: {
                productId,
                status: {
                    in: ['pending', 'processing', 'paid']
                },
                NOT: {
                    buyerId
                }
            }
        });
        if (doubleBooking) throw new Error('Este lote ya está reservado o en proceso de venta');
    },

    async create(data: {
        productId: number,
        buyerId: string,
        sellerId: string,
        amount: number,
        currency: string,
        buyerDeliveryAddress?: string,
        buyerDeliveryLat?: string,
        buyerDeliveryLng?: string,
    }, tx?: Prisma.TransactionClient) {
        const client = getClient(tx);
        return client.transaction.create({
            data
        });
    }
};
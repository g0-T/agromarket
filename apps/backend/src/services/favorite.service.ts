// File: src/services/favorite.service.ts
// Module responsible for backend functionality.

import prisma from '@/utils/prisma.js';

export async function getFavoriteByUserAndProduct(userId: string, productId: number) {
    return prisma.favorite.findUnique({
        where: { userId_productId: { userId, productId } }
    });
}

export async function listFavoritesForUser(userId: string) {
    return prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            product: {
                include: {
                    seller: {
                        select: { id: true, name: true, email: true, image: true, phone: true, role: true }
                    }
                }
            }
        }
    });
}

export async function createFavorite(userId: string, productId: number) {
    return prisma.favorite.upsert({
        where: { userId_productId: { userId, productId } },
        create: { userId, productId },
        update: {}
    });
}

export async function removeFavorite(userId: string, productId: number) {
    await prisma.favorite.deleteMany({
        where: { userId, productId }
    });
}

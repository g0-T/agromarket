// File: frontend/src/services/favorite.service.ts
// Frontend service module for API or client operations.

import api from '@/services/api.service';
import { Product } from '@/services/product.service.js';

// Type declaration FavoriteRecord.
export interface FavoriteRecord {
    id: string;
    product: Product;
}

export async function listFavorites() {
    const res = await api.get<{ success: boolean; data: FavoriteRecord[] }>('/favorites');
    return res.data.data;
}

export async function isProductFavorite(productId: number) {
    const res = await api.get<{ success: boolean; data: { favorited: boolean } }>(`/favorites/${productId}`);
    return res.data.data.favorited;
}

export async function addFavorite(productId: number) {
    const res = await api.post<{ success: boolean; data: FavoriteRecord }>(`/favorites/${productId}`);
    return res.data.data;
}

export async function removeFavorite(productId: number) {
    const res = await api.delete<{ success: boolean; data: { removed: boolean } }>(`/favorites/${productId}`);
    return res.data.data;
}

export async function toggleFavorite(productId: number, currentlyFavorited: boolean) {
    if (currentlyFavorited) {
        return removeFavorite(productId);
    }
    return addFavorite(productId);
}

// Default export for this module.
export default {
    listFavorites,
    isProductFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
};

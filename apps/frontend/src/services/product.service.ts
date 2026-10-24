// File: frontend/src/services/product.service.ts
// Frontend service module for API or client operations.

// src/services/product.service.ts
import api from '@/services/api.service';
import { Platform } from 'react-native';
import { getApiBaseUrl, getSocketUrl } from '@/utils/api-config';

const API_BASE = getApiBaseUrl();
const MEDIA_BASE_URL = getSocketUrl();

// Type declaration Product.
export interface Product {
    id: number;
    title: string;
    description?: string;
    price: number;
    currency?: string;
    category: string;
    breed?: string;
    type?: string;
    weight?: string;
    location?: string;
    heads?: number;
    age?: string;
    condition?: string;
    verified?: boolean;
    img?: string;
    sellerId?: string;
    seller?: {
        id: string;
        name?: string;
        image?: string;
        phone?: string;
        email?: string;
        role?: string;
    };
    attachments?: Array<{
        id: string;
        url: string;
        filename?: string;
        mimeType?: string;
    }>;
}

// Type declaration MediaUploadPayload.
export type MediaUploadPayload = {
    uri: string;
    type: 'image' | 'video';
    mimeType?: string;
    name?: string;
};

// Type declaration ListProductsParams.
export interface ListProductsParams {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    excludeSellerId?: string;
    includeTotal?: boolean;
    cursor?: { id: number; createdAt: string };
}

// Helper to convert Base64 to Blob (essential for Web)
const dataURItoBlob = (dataURI: string) => {
    const splitData = dataURI.split(',');
    const byteString = atob(splitData[1]);
    const mimeString = splitData[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
};

const normalizeMediaUrl = (url?: string | null) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url;
    if (url.startsWith('/')) {
        const base = MEDIA_BASE_URL.replace(/\/+$/, '');
        return `${base}${url}`;
    }
    return url;
};

const getUploadFileName = (id: number, name?: string, mimeType?: string) => {
    if (name) return name;
    if (mimeType?.includes('png')) return `product_${id}.png`;
    if (mimeType?.includes('jpg') || mimeType?.includes('jpeg')) return `product_${id}.jpg`;
    if (mimeType?.includes('mp4')) return `product_${id}.mp4`;
    return `product_${id}.bin`;
};

const normalizeProduct = (product?: Product | null): Product | undefined => {
    if (!product) return undefined;
    return {
        ...product,
        img: normalizeMediaUrl(product.img),
        attachments: (product.attachments || []).map((attachment) => ({
            ...attachment,
            url: normalizeMediaUrl(attachment.url) || attachment.url,
        })),
    };
};

export async function listProductsWithCount(params?: ListProductsParams) {
    const res = await api.get<{ success: boolean, data: Product[], total: number | null }>('/products', { params });
    const normalizedData = (res.data.data || [])
        .filter((p: any) => p.id && !isNaN(Number(p.id)))
        .map((product: Product) => normalizeProduct(product));
    return { data: normalizedData as Product[], total: res.data.total };
}

export async function getProduct(id: number) {
    if (isNaN(id)) throw new Error('Invalid product id');
    const res = await api.get<{ success: boolean, data: Product }>(`/products/${id}`);
    return normalizeProduct(res.data.data) as Product;
}

export async function createProduct(data: Omit<Product, 'id' | 'verified'> & { sellerId: string }) {
    const res = await api.post<{ success: boolean, data: Product }>('/products', data);
    return normalizeProduct(res.data.data) as Product;
}

export async function updateProduct(id: number, data: Partial<Omit<Product, 'id' | 'verified' | 'sellerId'>> | string | MediaUploadPayload) {
    // 1. Handle file upload with FormData
    if (typeof data === 'string' || (typeof data === 'object' && 'uri' in data)) {
        const formData = new FormData();
        const uri = typeof data === 'string' ? data : data.uri;
        const mimeType = (typeof data === 'object' && data.mimeType)
            ? data.mimeType
            : (typeof data === 'object' && data.type === 'video' ? 'video/mp4' : 'image/jpeg');
        const fileName = getUploadFileName(id, typeof data === 'object' ? data.name : undefined, mimeType);

        if (Platform.OS === 'web') {
            if (uri.startsWith('data:')) {
                const blob = dataURItoBlob(uri);
                formData.append('image', blob, fileName);
            } else {
                const response = await fetch(uri);
                const blob = await response.blob();
                formData.append('image', blob, fileName);
            }
        } else {
            const fileUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
            formData.append('image', {
                uri: fileUri,
                type: mimeType,
                name: fileName,
            } as any);
        }

        const res = await api.put<{ success: boolean, data: Product }>(`/products/${id}`, formData, {
            transformRequest: [(body) => body],
        });
        return normalizeProduct(res.data.data) as Product;
    }

    // 2. JSON data handling (product attributes)
    const res = await api.put<{ success: boolean, data: Product }>(`/products/${id}`, data);
    return normalizeProduct(res.data.data) as Product;
}

export async function deleteProduct(id: number) {
    await api.delete(`/products/${id}`);
}

// Default export for this module.
export default { listProductsWithCount, getProduct, createProduct, updateProduct, deleteProduct };
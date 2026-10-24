// File: src/services/product.service.ts
// Module responsible for backend functionality.

import prisma from '@/utils/prisma.js';
import type { Prisma } from '@prisma/client';
import { MemoryCache } from '@/utils/memory-cache.js';

const productCache = new MemoryCache();

// Exported symbol ProductCreateInput.
export interface ProductCreateInput {
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
    sellerId: string;
}

function buildListCacheKey(filter?: { category?: string; search?: string; take?: number; skip?: number; excludeSellerId?: string; includeTotal?: boolean; cursor?: { createdAt: string; id: number } }) {
    return [
        'products',
        filter?.category || '',
        filter?.search || '',
        filter?.take || 20,
        filter?.skip || 0,
        filter?.excludeSellerId || '',
        filter?.includeTotal ? '1' : '0',
        filter?.cursor?.id || '',
        filter?.cursor?.createdAt || '',
    ].join('|');
}

const PRODUCT_LIST_CACHE_TTL_MS = 1000 * 30; // 30 segundos
const PRODUCT_ITEM_CACHE_TTL_MS = 1000 * 30; // 30 segundos

export async function createProduct(data: ProductCreateInput) {
    const product = await prisma.product.create({
        data,
    });
    productCache.clearPrefix('products|');
    productCache.delete(`product:${product.id}`);
    return product;
}

export async function listProductsWithCount(filter?: { category?: string; search?: string; take?: number; skip?: number; excludeSellerId?: string; includeTotal?: boolean; cursor?: { createdAt: string; id: number } }) {
    const cacheKey = buildListCacheKey(filter);
    const cached = productCache.get<any>(cacheKey);
    if (cached) {
        return cached;
    }

    const take = filter?.take ? Number(filter.take) : 20;
    const skip = filter?.skip ? Number(filter.skip) : 0;

    const where: any = {};
    if (filter?.category) where.category = filter.category;
    if (filter?.excludeSellerId) where.sellerId = { not: filter.excludeSellerId };
    if (filter?.search) {
        where.OR = [
            { title: { contains: filter.search, mode: 'insensitive' } },
            { description: { contains: filter.search, mode: 'insensitive' } }
        ];
    }

    // Apply cursor-based pagination if provided (efficient for deep paging)
    if (filter?.cursor) {
        const cCreated = new Date(filter.cursor.createdAt);
        const cId = Number(filter.cursor.id);
        const cursorCondition = {
            OR: [
                { createdAt: { lt: cCreated } },
                { AND: [{ createdAt: { equals: cCreated } }, { id: { lt: cId } }] }
            ]
        };
        // combine with existing where
        if (Object.keys(where).length > 0) where.AND = [where, cursorCondition];
        else Object.assign(where, cursorCondition);
    }

    const query = {
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] as Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput>,
        skip,
        take,
        select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            location: true,
            weight: true,
            age: true,
            condition: true,
            verified: true,
            img: true,
            createdAt: true,
            sellerId: true,
            attachments: { select: { mimeType: true, url: true } }
        },
    };

    const products = await prisma.product.findMany(query);

    // compute next cursor when using cursor/paginated path or when includeTotal=false
    let nextCursor: { createdAt: string; id: number } | null = null;
    if (products.length === take) {
        const last = products[products.length - 1];
        nextCursor = { createdAt: last.createdAt.toISOString(), id: last.id } as any;
    }

    if (filter?.includeTotal === false) {
        const result = { products, total: null, nextCursor };
        productCache.set(cacheKey, result, PRODUCT_LIST_CACHE_TTL_MS);
        return result;
    }

    const total = await prisma.product.count({ where });
    const result = {
        products,
        total,
        nextCursor
    };
    productCache.set(cacheKey, result, PRODUCT_LIST_CACHE_TTL_MS);
    return result;
}

export async function getProductById(id: number) {
    const cacheKey = `product:${id}`;
    const cached = productCache.get<any>(cacheKey);
    if (cached) {
        return cached;
    }

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            seller: {
                select: { id: true, name: true, image: true, phone: true, email: true, role: true }
            },
            attachments: true
        }
    });

    if (product) {
        productCache.set(cacheKey, product, PRODUCT_ITEM_CACHE_TTL_MS);
    }
    return product;
}

export async function updateProduct(id: number, data: Partial<Omit<ProductCreateInput, 'sellerId'>>) {
    const product = await prisma.product.update({
        where: { id },
        data,
    });

    productCache.delete(`product:${id}`);
    productCache.clearPrefix('products|');
    return product;
}

export async function deleteProduct(id: number) {
    const product = await prisma.product.delete({
        where: { id },
    });

    productCache.delete(`product:${id}`);
    productCache.clearPrefix('products|');
    return product;
}
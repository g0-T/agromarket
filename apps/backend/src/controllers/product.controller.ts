// File: src/controllers/product.controller.ts
// Module responsible for backend functionality.

import { Request, Response } from 'express';
import * as productService from '@/services/product.service.js';
import prisma from '@/utils/prisma.js';
import logger from '@/logger/index.js';
import { uploadFile, deleteFiles } from '@/utils/storage.js';

const toPublicUrl = (req: Request, mediaUrl?: string | null) => {
    if (!mediaUrl) return null;
    if (/^https?:\/\//i.test(mediaUrl) || mediaUrl.startsWith('data:') || mediaUrl.startsWith('blob:')) return mediaUrl;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return new URL(mediaUrl.replace(/^\/+/, ''), baseUrl).toString();
};

const normalizeProductForResponse = (req: Request, product: any) => ({
    ...product,
    img: product?.img ? toPublicUrl(req, product.img) : product?.img,
    attachments: (product?.attachments || []).map((attachment: any) => ({
        ...attachment,
        url: attachment?.url ? toPublicUrl(req, attachment.url) : attachment?.url,
    })),
});

// Controller that handles listproducts requests.
export const listProductsController = async (req: Request, res: Response) => {
    try {
        const { category, search, page = 1, limit = 20, excludeSellerId, includeTotal, cursorId, cursorCreatedAt } = req.query as any;
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const shouldIncludeTotal = includeTotal === 'true' || Number(page) === 1;
        const cursor = (cursorId && cursorCreatedAt) ? { id: Number(cursorId), createdAt: String(cursorCreatedAt) } : undefined;
        const t0 = Date.now();
        const dbStart = Date.now();
        const { products, total, nextCursor } = await productService.listProductsWithCount({ category, search, take, skip, excludeSellerId, includeTotal: shouldIncludeTotal, cursor });
        const dbEnd = Date.now();

        const normalized = products.map((p: any) => {
            const imageFallback = p.attachments?.find((att: { mimeType?: string | null; url?: string | null }) => att.mimeType?.startsWith('image/'))?.url;
            const isVideoFile = typeof p.img === 'string' && /\.(mp4|mov|webm|mkv|avi|ogg)(\?.*)?$/i.test(p.img);
            const normalizedProduct = {
                ...p,
                img: isVideoFile ? (imageFallback || p.img) : p.img,
                price: typeof p.price === 'string' ? Number(p.price) : p.price,
                currency: typeof p.currency === 'string' ? p.currency : (p.currency || 'USD'),
            };
            return normalizeProductForResponse(req, normalizedProduct);
        });
        const normStart = Date.now();
        const normEnd = Date.now();
        const t1 = Date.now();

        logger.debug('[PERF] listProducts timings', {
            total: t1 - t0,
            db: dbEnd - dbStart,
            normalization: normEnd - normStart,
            productsReturned: products.length,
            includeTotal: shouldIncludeTotal,
        });
        res.json({ success: true, data: normalized, total, nextCursor });
    } catch (err: any) {
        logger.error('[PRODUCT] List products error', {
            message: err?.message,
            stack: err?.stack,
            code: err?.code,
            meta: err?.meta,
        });
        res.status(500).json({ success: false, message: 'No se pudieron listar los productos' });
    }
};

// Controller that handles createproduct requests.

export const createProductController = async (req: Request, res: Response) => {
    // 1. Extract the authenticated seller id from the auth middleware.
    // We'll call it 'sellerId' to keep consistency with the DB.
    const authenticatedSellerId = (req as any).user?.id;

    try {
        const payload = req.body;

        if (!authenticatedSellerId) {
            return res.status(401).json({ success: false, message: 'Autenticación requerida' });
        }

        const user = (req as any).user;
        if (user.role !== 'seller' && user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Solo vendedores aprobados pueden publicar productos' });
        }

        // 2. Merge the sanitized payload with the authenticated seller id.
        // Ensure the property name matches Prisma's schema exactly.
        const productData = {
            ...payload,
            sellerId: authenticatedSellerId
        };

        const product = await productService.createProduct(productData);

        res.status(201).json({ success: true, data: normalizeProductForResponse(req, product) });

    } catch (err: any) {
        // Detailed log for development
        logger.error('[PRODUCT] Create error. Data sent: %j. Error: %s',
            { sellerId: authenticatedSellerId, title: req.body.title },
            err.message
        );

        res.status(500).json({
            success: false,
            message: 'No se pudo crear el producto',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Controller that handles updateproduct requests.
export const updateProductController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const userId = (req as any).user?.id;

    const uploadedFiles: string[] = [];
    const bucket = 'product-images';

    try {
        if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID de producto inválido' });
        if (!userId) return res.status(401).json({ success: false, message: 'Autenticación requerida' });

        const product = await productService.getProductById(id);
        if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        if (product.sellerId !== userId) return res.status(403).json({ success: false, message: 'No autorizado' });

        const files = Array.isArray(req.files) ? (req.files as Express.Multer.File[]) : req.file ? [req.file] : [];
        if (files.length === 0) return res.status(400).json({ success: false, message: 'No se recibieron archivos multimedia' });

        let firstImageUrl: string | null = null;
        let firstVideoUrl: string | null = null;

        for (const [index, file] of files.entries()) {
            const { url: mediaUrl, key } = await uploadFile(file, bucket);
            uploadedFiles.push(key);

            await prisma.attachment.create({
                data: {
                    url: mediaUrl,
                    filename: file.originalname,
                    mimeType: file.mimetype,
                    type: 'product_media',
                    productId: id,
                    uploaderId: userId,
                },
            });

            if (file.mimetype.startsWith('image/') && !firstImageUrl) firstImageUrl = mediaUrl;
            else if (file.mimetype.startsWith('video/') && !firstVideoUrl) firstVideoUrl = mediaUrl;
        }

        const newImg = firstImageUrl || firstVideoUrl;
        if (newImg) await productService.updateProduct(id, { img: newImg });

        const updated = await productService.getProductById(id);
        res.json({ success: true, data: normalizeProductForResponse(req, updated) });

    } catch (err: any) {
        logger.error('[PRODUCT] Update error, starting rollback: %o', { productId: id, error: err.message });

        if (uploadedFiles.length > 0) {
            try {
                await deleteFiles(uploadedFiles, bucket);
                logger.info('[PRODUCT] Rollback successful: Orphaned files removed');
            } catch (rollbackErr) {
                logger.error('[PRODUCT] Critical error during rollback: %o', rollbackErr);
            }
        }

        res.status(500).json({ success: false, message: 'Error al actualizar: se canceló la operación para evitar datos corruptos.' });
    }
};

// Controller that handles deleteproduct requests.
export const deleteProductController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const userId = (req as any).user?.id;

    try {
        if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID de producto inválido' });
        if (!userId) return res.status(401).json({ success: false, message: 'Autenticación requerida' });

        const product = await productService.getProductById(id);
        if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        if (product.sellerId !== userId) return res.status(403).json({ success: false, message: 'No autorizado' });

        await productService.deleteProduct(id);
        res.status(204).send();
    } catch (err: any) {
        logger.error('[PRODUCT] Delete product error %o', err);
        res.status(500).json({ success: false, message: 'No se pudo eliminar el producto' });
    }
};

// Controller that handles getproduct requests.
export const getProductController = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID de producto inválido' });

        const product = await productService.getProductById(id);
        if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

        const imageFallback = product.attachments?.find((att: { mimeType?: string | null; url?: string | null }) => att.mimeType?.startsWith('image/'))?.url;
        const isVideoFile = typeof product.img === 'string' && /\.(mp4|mov|webm|mkv|avi|ogg)(\?.*)?$/i.test(product.img);
        const normalized = {
            ...product,
            img: isVideoFile ? (imageFallback || product.img) : product.img,
            price: typeof product.price === 'string' ? Number(product.price) : product.price,
            currency: typeof product.currency === 'string' ? product.currency : (product.currency || 'USD'),
        };
        res.json({ success: true, data: normalizeProductForResponse(req, normalized) });
    } catch (err: any) {
        logger.error('[PRODUCT] Get product error %o', err);
        res.status(500).json({ success: false, message: 'Error interno al buscar el producto' });
    }
};


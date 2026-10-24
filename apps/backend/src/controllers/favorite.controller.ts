// File: src/controllers/favorite.controller.ts
// Module responsible for backend functionality.

import { Request, Response } from 'express';
import * as favoriteService from '@/services/favorite.service.js';
import * as productService from '@/services/product.service.js';
import logger from '@/logger/index.js';

// Controller that handles listfavorites requests.
export const listFavoritesController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Autenticación requerida' });

        const favorites = await favoriteService.listFavoritesForUser(userId);
        res.json({ success: true, data: favorites });
    } catch (err: any) {
        logger.error('[FAVORITES] List error: %o', { userId: (req as any).user?.id, error: err.message });
        res.status(500).json({ success: false, message: 'No se pudieron cargar los favoritos' });
    }
};

// Controller that handles getfavorite requests.
export const getFavoriteController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const productId = Number(req.params.productId);

        if (!userId) return res.status(401).json({ success: false, message: 'Autenticación requerida' });
        if (isNaN(productId)) return res.status(400).json({ success: false, message: 'ID de producto inválido' });

        const favorite = await favoriteService.getFavoriteByUserAndProduct(userId, productId);
        res.json({ success: true, data: { favorited: Boolean(favorite) } });
    } catch (err: any) {
        logger.error('[FAVORITES] Get status error: %o', { userId: (req as any).user?.id, productId: req.params.productId, error: err.message });
        res.status(500).json({ success: false, message: 'No se pudo verificar el estado de favorito' });
    }
};

// Controller that handles createfavorite requests.
export const createFavoriteController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const productId = Number(req.params.productId);

        if (!userId) return res.status(401).json({ success: false, message: 'Autenticación requerida' });
        if (isNaN(productId)) return res.status(400).json({ success: false, message: 'ID de producto inválido' });

        const product = await productService.getProductById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Producto no encontrado' });

        const favorite = await favoriteService.createFavorite(userId, productId);
        res.status(201).json({ success: true, data: favorite });
    } catch (err: any) {
        logger.error('[FAVORITES] Create error: %o', { userId: (req as any).user?.id, productId: req.params.productId, error: err.message });
        res.status(500).json({ success: false, message: 'No se pudo guardar en favoritos' });
    }
};

// Controller that handles deletefavorite requests.
export const deleteFavoriteController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const productId = Number(req.params.productId);

        if (!userId) return res.status(401).json({ success: false, message: 'Autenticación requerida' });
        if (isNaN(productId)) return res.status(400).json({ success: false, message: 'ID de producto inválido' });

        await favoriteService.removeFavorite(userId, productId);
        res.json({ success: true, data: { removed: true } });
    } catch (err: any) {
        logger.error('[FAVORITES] Delete error: %o', { userId: (req as any).user?.id, productId: req.params.productId, error: err.message });
        res.status(500).json({ success: false, message: 'No se pudo eliminar de favoritos' });
    }
};
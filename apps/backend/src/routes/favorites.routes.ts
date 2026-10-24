// File: src/routes/favorites.routes.ts
// Module responsible for backend functionality.

import { Router } from 'express';
import { listFavoritesController, getFavoriteController, createFavoriteController, deleteFavoriteController } from '@/controllers/favorite.controller.js';
import { isAuth } from '@/middlewares/auth.middleware.js';

const router = Router();

router.use(isAuth);
router.get('/', listFavoritesController);
router.get('/:productId', getFavoriteController);
router.post('/:productId', createFavoriteController);
router.delete('/:productId', deleteFavoriteController);

// Default export for module usage.
export default router;

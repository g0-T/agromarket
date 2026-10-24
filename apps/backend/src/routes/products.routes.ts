// File: src/routes/products.routes.ts
// Module responsible for backend functionality.

import { Router } from 'express';
import multer from 'multer';
import { listProductsController, createProductController, getProductController, updateProductController, deleteProductController } from '@/controllers/product.controller.js';
import { isAuth } from '@/middlewares/auth.middleware.js';
import { validateBody } from '@/middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '@/validators/product.validators.js';

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes o videos'));
        }
    },
});

router.get('/', listProductsController);
router.get('/:id(\\d+)', getProductController);

router.post('/', isAuth, upload.array('image', 5), validateBody(createProductSchema), createProductController);

router.put('/:id', isAuth, upload.array('image', 10), validateBody(updateProductSchema), updateProductController);

router.delete('/:id', isAuth, deleteProductController);

// Default export for module usage.
export default router;
// File: src/routes/sellerApplications.routes.ts
// Module responsible for backend functionality.

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { submitApplication, getApplications, getMyApplication, approveApplication, rejectApplication } from '@/controllers/sellerApplication.controller.js';
import { isAuth } from '@/middlewares/auth.middleware.js';
import { requireRole } from '@/middlewares/admin.middleware.js';
import logger from '@/logger/index.js';
import { validateBody } from '@/middlewares/validate.middleware.js';
import { submitApplicationSchema, approveApplicationSchema, rejectApplicationSchema } from '@/validators/application.validators.js';

const router = Router();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5
    },
    fileFilter: (req, file, cb) => {
        logger.debug('[MULTER] Processing file:', { name: file.originalname, fieldname: file.fieldname, mimetype: file.mimetype });
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Solo se permiten JPEG, PNG o PDF.'));
        }
    },
});

router.post('/', isAuth, upload.array('documents', 5), (req, res, next) => {
    logger.debug('[AFTER_MULTER] req.body:', req.body);
    logger.debug('[AFTER_MULTER] req.files:', req.files);
    next();
}, validateBody(submitApplicationSchema), submitApplication);

router.get('/me', isAuth, getMyApplication);

router.get('/', isAuth, requireRole('admin'), getApplications);

router.put('/:id/approve', isAuth, requireRole('admin'), validateBody(approveApplicationSchema), approveApplication);

router.put('/:id/reject', isAuth, requireRole('admin'), validateBody(rejectApplicationSchema), rejectApplication);

router.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'El archivo es muy pesado. Máximo 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Error al subir archivo: ${err.message}`
        });
    }

    if (err.message && /Invalid file type/i.test(err.message)) {
        return res.status(400).json({
            success: false,
            message: 'Archivo no permitido. Solo se aceptan JPG, PNG y PDF'
        });
    }

    next(err);
});

// Default export for module usage.
export default router;
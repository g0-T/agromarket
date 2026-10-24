// File: src/routes/users.routes.ts
// Module responsible for backend functionality.

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { getUser, updateProfile } from '@/controllers/user.controller.js';
import { isAuth } from '@/middlewares/auth.middleware.js';
import { validateBody } from '@/middlewares/validate.middleware.js';
import { updateProfileSchema } from '@/validators/user.validators.js';

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});

router.get('/:id', getUser);
router.patch('/profile', isAuth, upload.single('image'), validateBody(updateProfileSchema), updateProfile);

router.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError || (err.message && /Invalid file type/i.test(err.message))) {
        return res.status(400).json({
            success: false,
            message: 'Foto no permitida. Solo JPG/PNG hasta 5MB.'
        });
    }
    next(err);
});

// Default export for module usage.
export default router;
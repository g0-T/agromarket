// File: src/types/multer.d.ts
// Module responsible for backend functionality.

import { Request } from 'express';
import multer from 'multer';

declare global {
    namespace Express {
        interface Request {
            file?: multer.File;
        }
    }
}
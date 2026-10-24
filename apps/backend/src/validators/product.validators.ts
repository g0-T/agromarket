// File: src/validators/product.validators.ts
// Module responsible for backend functionality.

import { z } from 'zod';
import { CATEGORIES } from '@/constants/filters.js';

// Validation schema for createproduct payloads.
export const createProductSchema = z.object({
    title: z.string().min(5, 'El título debe ser más descriptivo').max(100),
    description: z.string().max(1000, 'Descripción demasiado larga').optional(),

    price: z.coerce.number().positive('El precio debe ser mayor a 0'),

    currency: z.string().default('USD'),

    category: z.enum(CATEGORIES, {
        error: "Selecciona una categoría válida"
    }),

    breed: z.string().optional(),
    type: z.enum(['Machos', 'Hembras', 'Cría']).optional(),

    weight: z.string().optional(),
    location: z.string().min(1, 'La ubicación es obligatoria'),

    heads: z.coerce.number().int().positive().default(1),

    age: z.string().optional(),
    condition: z.string().optional(),

    img: z.string().url().optional(),
});

// Validation schema for updateproduct payloads.
export const updateProductSchema = createProductSchema.partial();
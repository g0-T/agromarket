// File: src/schemas/product.schema.ts
// Module responsible for backend functionality.

import { z } from 'zod';
import { CATEGORIES, LOCATIONS, BREEDS } from '@/constants/filters.js';

// Validation schema for createproduct payloads.
export const createProductSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),

  type: z.enum(['Machos', 'Hembras', 'Cría'], {
    error: "Seleccione un tipo válido"
  }),

  category: z.enum(CATEGORIES, {
    error: "Categoría de ganado no reconocida"
  }),

  breed: z.enum(BREEDS).optional(),

  location: z.enum(LOCATIONS, {
    error: "Ubicación fuera de la zona de cobertura"
  }),

  age: z.enum(['Desconocido', '0-6 meses', '6-12 meses', '1-2 años', '2-4 años', '4+ años']).default('Desconocido'),
  condition: z.enum(['Desconocido', 'Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala']).default('Desconocido'),

  price: z.coerce.number().positive("El precio es obligatorio"),
  quantity: z.coerce.number().int().min(1, "Mínimo 1 animal"),
  weight: z.coerce.number().optional(),
});
// File: src/validators/application.validators.ts
// Module responsible for backend functionality.

import { z } from 'zod';

// Validation schema for submitapplication payloads.
export const submitApplicationSchema = z.object({
    reason: z.string().min(10, 'Explica por qué quieres vender en el marketplace').max(500, 'La razón no puede pasar de 500 caracteres').optional(),
    farmLocationLat: z.string().optional(),
    farmLocationLng: z.string().optional(),
    farmLocationAddress: z.string().optional()
});

// Validation schema for approveapplication payloads.
export const approveApplicationSchema = z.object({
    notes: z.string().max(500).optional(),
});

// Validation schema for rejectapplication payloads.
export const rejectApplicationSchema = z.object({
    notes: z.string().max(500).optional(),
    isFinal: z.boolean().optional(),
});

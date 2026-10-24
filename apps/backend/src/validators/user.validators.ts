// File: src/validators/user.validators.ts
// Module responsible for backend functionality.

import { z } from 'zod';

// Validation schema for updateprofile payloads.
export const updateProfileSchema = z.object({
    name: z.string().min(2, 'El nombre es muy corto').max(50, 'El nombre es muy largo').optional(),
});

// File: src/validators/transaction.validators.ts
// Module responsible for backend functionality.

import { z } from 'zod';

// Validation schema for createtransaction payloads.
export const createTransactionSchema = z.object({
  productId: z.coerce.number().int().positive('ID de producto inválido'),
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  currency: z.string().trim().min(1, 'Moneda inválida').optional(),
  buyerDeliveryAddress: z.string().trim().min(1, 'Dirección inválida').optional(),
  buyerDeliveryLat: z.string().trim().optional(),
  buyerDeliveryLng: z.string().trim().optional(),
});

// Validation schema for chatmessage payloads.
export const chatMessageSchema = z.object({
  text: z.string().min(1, 'El mensaje no puede estar vacío').max(1000),
});

export const deliveryLocationSchema = z.object({
  buyerDeliveryAddress: z.string().trim().min(1, 'Dirección inválida'),
  buyerDeliveryLat: z.string().trim().min(1, 'Latitud inválida'),
  buyerDeliveryLng: z.string().trim().min(1, 'Longitud inválida'),
});

export const verifyDeliveryTokenSchema = z.object({
  token: z.string().trim().min(4, 'Token inválido').max(12),
});

// Validation schema for adminresolvetransaction payloads.
export const adminResolveTransactionSchema = z.object({
  status: z.string().trim().min(1, 'Estado es requerido'),
  notes: z.string().max(1000).optional(),
});

// Validation schema for createdispute payloads.
export const createDisputeSchema = z.object({
  transactionId: z.string().trim().min(1, 'ID de transacción requerido'),
  reason: z.string().trim().min(10, 'La razón debe tener al menos 10 caracteres').max(1000, 'La razón no puede exceder 1000 caracteres'),
});

// Validation schema for adminresolvedispute payloads.
export const adminResolveDisputeSchema = z.object({
  status: z.enum(['resolved', 'closed']).refine((val) => val === 'resolved' || val === 'closed', {
    message: 'Estado debe ser "resolved" o "closed"'
  }),
  adminNotes: z.string().max(1000).optional(),
});

// File: src/validators/auth.validators.ts
// Module responsible for backend functionality.

import { z } from 'zod';
import { validateBody } from '@/middlewares/validate.middleware.js';

const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 20;
const NAME_MAX_LENGTH = 100;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido').max(EMAIL_MAX_LENGTH),
  password: z.string().min(PASSWORD_MIN_LENGTH, 'Mínimo 6 caracteres').max(PASSWORD_MAX_LENGTH),
});

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido').max(EMAIL_MAX_LENGTH),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
  name: z.string().min(1, 'El nombre es obligatorio').max(NAME_MAX_LENGTH),
});

const verifyEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(EMAIL_MAX_LENGTH),
  otp: z.string().length(6, 'El OTP debe tener 6 dígitos').regex(/^\d+$/, 'Solo números'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token es requerido'),
});

const requestOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido').max(EMAIL_MAX_LENGTH).optional(),
  phone: z.string().trim().min(10, 'Teléfono inválido').max(15, 'Teléfono inválido').optional(),
}).refine((data) => Boolean(data.email || data.phone), {
  message: 'Email o teléfono es obligatorio',
});

const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email inválido').max(EMAIL_MAX_LENGTH).optional(),
  phone: z.string().trim().min(10, 'Teléfono inválido').max(15, 'Teléfono inválido').optional(),
  otp: z.string().length(6, 'El OTP debe tener 6 dígitos').regex(/^\d+$/, 'Solo números'),
  isLogin: z.boolean().optional(),
}).refine((data) => Boolean(data.email || data.phone), {
  message: 'Email o teléfono es obligatorio',
});

// Exported function validateLogin.
export const validateLogin = validateBody(loginSchema);
// Exported function validateRegister.
export const validateRegister = validateBody(registerSchema);
// Exported function validateVerifyEmail.
export const validateVerifyEmail = validateBody(verifyEmailSchema);
// Exported function validateRefreshToken.
export const validateRefreshToken = validateBody(refreshTokenSchema);
// Exported function validateRequestOtp.
export const validateRequestOtp = validateBody(requestOtpSchema);
// Exported function validateVerifyOtp.
export const validateVerifyOtp = validateBody(verifyOtpSchema);

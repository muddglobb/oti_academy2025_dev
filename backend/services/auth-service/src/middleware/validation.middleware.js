import { z } from 'zod';
import { ApiResponse } from '../utils/api-response.js';

// Phone number validation regex (Indonesia format)
const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;

// Registration schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  type: z.enum(['DIKE', 'UMUM'], {
    errorMap: () => ({ message: 'Type must be either DIKE or UMUM' }),
  }),
  nim: z.string().optional(),
  phone: z.string()
    .regex(phoneRegex, 'Format nomor HP tidak valid. Gunakan format: 08xxxxxxxxxx, +62xxxxxxxxx, atau 62xxxxxxxxx')
    .optional() // Optional untuk backward compatibility
}).refine(data => {
  // If type is DIKE, nim is required
  if (data.type === 'DIKE' && !data.nim) {
    return false;
  }
  return true;
}, {
  message: 'NIM is required for DIKE students',
  path: ['nim'],
});

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// Reset password schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Change password schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Update profile schema - UPDATED untuk include phone
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string()
    .regex(phoneRegex, 'Format nomor HP tidak valid. Gunakan format: 08xxxxxxxxxx, +62xxxxxxxxx, atau 62xxxxxxxxx')
    .optional()
});

// BARU: Phone update schema untuk payment flow
const updatePhoneSchema = z.object({
  phone: z.string()
    .regex(phoneRegex, 'Format nomor HP tidak valid. Gunakan format: 08xxxxxxxxxx, +62xxxxxxxxx, atau 62xxxxxxxxx')
    .min(10, 'Nomor HP minimal 10 digit')
    .max(15, 'Nomor HP maksimal 15 digit')
});

// Validation middleware factory
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    // Extract Zod validation errors
    const errors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    return res.status(400).json(
      ApiResponse.error('Validation failed', errors)
    );
  }
};

// Refresh token schema
const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const validateTokenRequest = validate(validateTokenSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
export const validateUpdatePhone = validate(updatePhoneSchema); // BARU
export const validateRefreshToken = validate(refreshTokenSchema);
export const validateRegistration = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateResetPassword = validate(resetPasswordSchema);
export const validateChangePassword = validate(changePasswordSchema);
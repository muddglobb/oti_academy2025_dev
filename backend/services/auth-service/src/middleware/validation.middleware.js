import { z } from 'zod';
import { ApiResponse } from '../utils/api-response.js';

// Registration schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  type: z.enum(['DIKE', 'UMUM'], {
    errorMap: () => ({ message: 'Type must be either DIKE or UMUM' }),
  }),
  nim: z.string().optional(),
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

export const validateRegistration = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateResetPassword = validate(resetPasswordSchema);
export const validateChangePassword = validate(changePasswordSchema);
import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  changePassword,
  updateProfile
} from '../controllers/auth.controller.js';
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateUpdateProfile,
  validateRefreshToken,
  validateTokenRequest
} from '../middleware/validation.middleware.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

import {
  securityLimiter,
  standardLimiter
} from '../middleware/rateLimiter.js'

const router = Router();

// Public routes
router.post('/register', securityLimiter, validateRegistration, register);
router.post('/login', securityLimiter, validateLogin, login);
router.post('/refresh-token', standardLimiter, validateRefreshToken, refreshToken);
router.post('/forgot-password', securityLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password', securityLimiter, validateResetPassword, resetPassword);
router.get('/verify-reset/:token', standardLimiter, verifyResetToken);
router.post('/validate-token', validateTokenRequest, validateTokenRequest);

// Protected routes
router.post('/logout', authenticateJWT, logout);

router.patch('/change-password', authenticateJWT, validateChangePassword, changePassword);
router.patch('/update-profile', authenticateJWT, validateUpdateProfile, updateProfile);

export default router;
import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getMe,
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
  validateRefreshToken
} from '../middleware/validation.middleware.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', validateRefreshToken, refreshToken);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.get('/verify-reset/:token', verifyResetToken);

// Protected routes
router.post('/logout', authenticateJWT, logout);
router.get('/me', authenticateJWT, getMe);
router.patch('/change-password', authenticateJWT, validateChangePassword, changePassword);
router.patch('/update-profile', authenticateJWT, validateUpdateProfile, updateProfile);

export default router;
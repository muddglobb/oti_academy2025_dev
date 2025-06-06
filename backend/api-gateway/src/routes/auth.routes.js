import { Router } from 'express';
import { createDirectHandler, upload } from '../utils/directHandler.js';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidator.js';
import { handleLogout, handleTokenRefresh, cacheNewToken, handleLoginResponse } from '../controllers/authController.js';
import { passwordResetLimiter, uploadLimiter, adminLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Get AUTH_SERVICE_URL with fallback
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service-api:8001';
console.log('Using AUTH_SERVICE_URL:', AUTH_SERVICE_URL);

// Password reset endpoints with stricter rate limiting
router.post('/forgot-password', 
  passwordResetLimiter,
  createDirectHandler(
    AUTH_SERVICE_URL,
    '/auth',
    false
  )
);

router.post('/reset-password', 
  passwordResetLimiter,
  createDirectHandler(
    AUTH_SERVICE_URL,
    '/auth',
    false
  )
);

// Admin file upload with upload limiter and admin access
router.post('/admin/import-dike-students', 
  adminLimiter,
  jwtValidatorMiddleware, 
  upload.single('file'),
  async (req, res, next) => {
    // If file upload failed or no file was provided
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded or invalid file format'
      });
    }
    // Continue to the direct handler if file was uploaded successfully
    next();
  },
  createDirectHandler(
    AUTH_SERVICE_URL,
    '/auth', // Using the full path to avoid path construction issues
    true
  )
);

// Route khusus untuk logout - menggunakan middleware handleLogout untuk invalidasi token
router.post('/logout', 
  handleLogout, 
  createDirectHandler(
    AUTH_SERVICE_URL,
    '/auth',
    false
  )
);

router.post('/login',
  handleLoginResponse,
  createDirectHandler(AUTH_SERVICE_URL, '/auth', false)
);

// Route khusus untuk refresh token - menambahkan middleware cacheNewToken
router.post('/refresh-token',
  handleTokenRefresh,
  createDirectHandler(
    AUTH_SERVICE_URL,
    '/auth',
    false
  ),
  cacheNewToken
);

// Route all other /auth requests to the Auth service
router.use('/', createDirectHandler(
  AUTH_SERVICE_URL,
  '/auth',
  false, // We'll handle auth in the service itself
  false
));

export default router;
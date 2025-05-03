import { Router } from 'express';
import { createDirectHandler, upload } from '../utils/directHandler.js';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidator.js';

const router = Router();

// Get AUTH_SERVICE_URL with fallback
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service-api:8001';
console.log('Using AUTH_SERVICE_URL:', AUTH_SERVICE_URL);

// Special route for file upload - Fixed path
router.post('/admin/import-dike-students', 
  jwtValidatorMiddleware, 
  upload.single('file'),
  createDirectHandler(
    AUTH_SERVICE_URL,
    '/auth', // Using just the base path to avoid duplication
    true
  )
);

// Route all other /auth requests to the Auth service
router.use('/', createDirectHandler(
  AUTH_SERVICE_URL,
  '/auth',
  false, // We'll handle auth in the service itself
  false
));

export default router;
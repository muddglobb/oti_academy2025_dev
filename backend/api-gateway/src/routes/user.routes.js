import { Router } from 'express';
import { createDirectHandler } from '../utils/directHandler.js';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidator.js';

const router = Router();

// Get AUTH_SERVICE_URL with fallback
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service-api:8001';

// Route all user requests to the Auth service
router.use('/', 
  jwtValidatorMiddleware,
  createDirectHandler(
    AUTH_SERVICE_URL,
    '/users',
    true
  )
);

export default router;
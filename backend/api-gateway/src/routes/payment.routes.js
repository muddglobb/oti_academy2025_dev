import { Router } from 'express';
import { createDirectHandler } from '../utils/directHandler.js';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidator.js';

const router = Router();

// Get PAYMENT_SERVICE_URL with fallback
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service-api:8006';
console.log('Using PAYMENT_SERVICE_URL:', PAYMENT_SERVICE_URL);

// Route all payment requests to the Payment & Enrollment service
router.use('/', createDirectHandler(
  PAYMENT_SERVICE_URL,
  '/payments',
  true, // Requires authentication
  false, // Not optional auth
  jwtValidatorMiddleware // Use JWT validator middleware
));

export default router;
import { Router } from 'express';
import { createDirectHandler } from '../utils/directHandler.js';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidator.js';

const router = Router();

// Get PAYMENT_SERVICE_URL with fallback
const MATERIAL_SERVICE_URL = process.env.MATERIAL_SERVICE_URL || 'http://material-service-api:8003';
console.log('Using MATERIAL_SERVICE_URL:', MATERIAL_SERVICE_URL);

// Route all payment requests to the MATERIAL_SERVICE_URL
router.use('/', createDirectHandler(
  MATERIAL_SERVICE_URL,
  '/materials',
  true, // Requires authentication
  false, // Not optional auth
  jwtValidatorMiddleware // Use JWT validator middleware
));

export default router;
import { Router } from 'express';
import { createDirectHandler } from '../utils/directHandler.js';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidator.js';

const router = Router();

// Get ENROLLMENT_SERVICE_URL with fallback
const ENROLLMENT_SERVICE_URL = process.env.ENROLLMENT_SERVICE_URL || 'http://enrollment-service-api:8007';
console.log('Using ENROLLMENT_SERVICE_URL:', ENROLLMENT_SERVICE_URL);

// Route all enrollment requests to the Enrollment service
router.use('/', createDirectHandler(
  ENROLLMENT_SERVICE_URL,
  '/enrollments',
  false, // Requires authentication (handled by service)
  false, // Not optional auth
  jwtValidatorMiddleware // Use JWT validator middleware
));

export default router;

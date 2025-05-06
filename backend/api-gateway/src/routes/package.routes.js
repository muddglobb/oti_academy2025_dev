import { Router } from 'express';
import { createDirectHandler } from '../utils/directHandler.js';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidator.js';

const router = Router();

// Get PACKAGE_SERVICE_URL with fallback
const PACKAGE_SERVICE_URL = process.env.PACKAGE_SERVICE_URL || 'http://package-service-api:8003';
console.log('Using PACKAGE_SERVICE_URL:', PACKAGE_SERVICE_URL);

// Route all package requests to the Package service
router.use('/', createDirectHandler(
  PACKAGE_SERVICE_URL,
  '/packages',
  true, // Requires authentication
  false, // Not optional auth
  jwtValidatorMiddleware // Use JWT validator middleware
));

// Route for package courses
router.use('/:packageId/courses', createDirectHandler(
  PACKAGE_SERVICE_URL,
  '/packages',
  true, // Requires authentication
  false, // Not optional auth
  jwtValidatorMiddleware // Use JWT validator middleware
));

export default router;
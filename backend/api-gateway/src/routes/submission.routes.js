import { Router } from 'express';
import { createDirectHandler } from '../utils/directHandler.js';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidator.js';

const router = Router();

// Get ASSIGNMENT_SERVICE_URL with fallback
const ASSIGNMENT_SERVICE_URL = process.env.ASSIGNMENT_SERVICE_URL || 'http://assignment-service-api:8004';
console.log('Using SUBMISSION_SERVICE_URL:', ASSIGNMENT_SERVICE_URL);

router.use('/', createDirectHandler(
  ASSIGNMENT_SERVICE_URL,
  '/submissions',
  true, // Requires authentication
  false, // Not optional auth
  jwtValidatorMiddleware // Use JWT validator middleware
));

export default router;

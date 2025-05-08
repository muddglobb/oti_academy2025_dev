import { Router } from 'express';
import { createDirectHandler } from '../utils/directHandler.js';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidator.js';

const router = Router();

// Get COURSE_SERVICE_URL with fallback
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL || 'http://course-service-api:8002';
console.log('Using COURSE_SERVICE_URL:', COURSE_SERVICE_URL);

// Route all course requests to the Course service
router.use('/', createDirectHandler(
  COURSE_SERVICE_URL,
  '/courses',
  false, // Requires authentication
  false, // Not optional auth
  jwtValidatorMiddleware // Use JWT validator middleware
));

// Route for sessions
router.use('/:courseId/sessions', createDirectHandler(
  COURSE_SERVICE_URL,
  '/courses',
  false, // Requires authentication
  false, // Not optional auth
  jwtValidatorMiddleware // Use JWT validator middleware
));

// Route for admin actions
router.use('/admin', createDirectHandler(
  COURSE_SERVICE_URL,
  '/admin/courses',
  true, // Requires authentication
  false, // Not optional auth
  jwtValidatorMiddleware // Use JWT validator middleware
));

export default router;
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getCourses, getCourseById, getBatchCourses } from '../controllers/course.controller.js';
import { getSessionsByCourse } from '../controllers/session.controller.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';
import { createRateLimiter, publicApiLimiter, batchApiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply caching to GET requests with TTL of 30 minutes
const courseCacheTTL = 30 * 60; // 30 minutes

// Rate limiting configuration
const standardLimiter = createRateLimiter({
  name: 'Course API',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all routes (with service-to-service exemption)
router.use(Array.isArray(standardLimiter) ? standardLimiter : [standardLimiter]);

// Batch endpoint for service-to-service communication (higher rate limit tolerance)
router.post('/batch', Array.isArray(batchApiLimiter) ? batchApiLimiter : [batchApiLimiter], getBatchCourses);

// All other routes require authentication
router.get('/', cacheMiddleware('courses', courseCacheTTL), getCourses);
router.get('/:id', cacheMiddleware('course', courseCacheTTL), getCourseById);
router.get('/:courseId/sessions', cacheMiddleware('course-sessions', courseCacheTTL), getSessionsByCourse);

export default router;
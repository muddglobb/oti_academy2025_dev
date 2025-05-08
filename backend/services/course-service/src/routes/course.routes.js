import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getCourses, getCourseById } from '../controllers/course.controller.js';
import { getSessionsByCourse } from '../controllers/session.controller.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';

const router = Router();

// Apply caching to GET requests with TTL of 30 minutes
const courseCacheTTL = 30 * 60; // 30 minutes

// All routes require authentication
router.get('/', cacheMiddleware('courses', courseCacheTTL), getCourses);
router.get('/:id', cacheMiddleware('course', courseCacheTTL), getCourseById);
router.get('/:courseId/sessions', cacheMiddleware('course-sessions', courseCacheTTL), getSessionsByCourse);

export default router;
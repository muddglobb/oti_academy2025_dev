import { Router } from 'express';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById
} from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../config/auth.js'; 
import { Roles } from '../libs/roles.js';
import { validateCourseCreation, validateCourseUpdate } from '../utils/validation.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Create admin rate limiter
const adminLimiter = createRateLimiter({
    name: 'Admin Operations',
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 2000 // limit admin operations
});

// Apply admin rate limiter to all admin routes
router.use(Array.isArray(adminLimiter) ? adminLimiter : [adminLimiter]);

// Admin-only routes
router.get('/courses', cacheMiddleware('admin-courses', 15 * 60), authenticate, authorizeRoles(Roles.ADMIN), getAllCourses);
router.post('/courses', invalidateCache('courses'), authenticate, authorizeRoles(Roles.ADMIN), validateCourseCreation, createCourse);
router.get('/courses/:id', cacheMiddleware('admin-course', 15 * 60), authenticate, authorizeRoles(Roles.ADMIN), getCourseById);
router.put('/courses/:id', invalidateCache('course'), authenticate, authorizeRoles(Roles.ADMIN), validateCourseUpdate, updateCourse);
router.delete('/courses/:id', invalidateCache('course'), authenticate, authorizeRoles(Roles.ADMIN), deleteCourse);

export default router;
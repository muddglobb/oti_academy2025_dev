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

const router = Router();

// Admin-only routes
router.get('/courses', cacheMiddleware('admin-courses', 15 * 60), authenticate, authorizeRoles(Roles.ADMIN), getAllCourses);
router.post('/courses', invalidateCache('courses'), authenticate, authorizeRoles(Roles.ADMIN), validateCourseCreation, createCourse);
router.get('/courses/:id', cacheMiddleware('admin-course', 15 * 60), authenticate, authorizeRoles(Roles.ADMIN), getCourseById);
router.put('/courses/:id', invalidateCache('course'), authenticate, authorizeRoles(Roles.ADMIN), validateCourseUpdate, updateCourse);
router.delete('/courses/:id', invalidateCache('course'), authenticate, authorizeRoles(Roles.ADMIN), deleteCourse);

export default router;
import { Router } from 'express';
import {
  addCourseToPackage,
  removeCourseFromPackage,
  listCoursesInPackage
} from '../controllers/packageCourse.controller.js';
import { authenticate, permit, Roles } from '../config/auth.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';

const router = Router();

// Route: /package-courses
router.route('/')
  .post(authenticate, permit(Roles.ADMIN), invalidateCache('package'), addCourseToPackage)
  .delete(authenticate, permit(Roles.ADMIN), invalidateCache('package'), removeCourseFromPackage);

// Route: /package-courses/:packageId
router.route('/:packageId')
  .get(cacheMiddleware('package-courses', 30 * 60), listCoursesInPackage); // Semua role bisa mengakses dengan cache

export default router;
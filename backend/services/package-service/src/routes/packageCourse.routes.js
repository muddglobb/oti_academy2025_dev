import { Router } from 'express';
import {
  addCourseToPackage,
  removeCourseFromPackage,
  listCoursesInPackage
} from '../controllers/packageCourse.controller.js';
import { authenticate, permit, Roles } from '../config/auth.js';

const router = Router();

// Route: /package-courses
router.route('/')
  .post(authenticate, permit(Roles.ADMIN), addCourseToPackage)
  .delete(authenticate, permit(Roles.ADMIN), removeCourseFromPackage);

// Route: /package-courses/:packageId
router.route('/:packageId')
  .get(authenticate, listCoursesInPackage); // Semua role bisa mengakses

export default router;
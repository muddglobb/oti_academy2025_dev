import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getCourses, getCourseById } from '../controllers/course.controller.js';
import { getSessionsByCourse } from '../controllers/session.controller.js';

const router = Router();

// All routes require authentication
router.get('/', authenticate, getCourses);
router.get('/:id', authenticate, getCourseById);
router.get('/:courseId/sessions', authenticate, getSessionsByCourse);

export default router;
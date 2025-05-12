import express from 'express';
import {
  getUserEnrollments,
  getEnrollmentById,
  checkEnrollmentStatus,
  updateProgress,
  getAllEnrollments,
  checkIsEnrolled
} from '../controllers/enrollment.controller.js';
import { authenticate, permit } from '../utils/rbac/index.js';
import { createRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

const adminLimiter = createRateLimiter({
  name: 'Admin Operations',
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2000 // limit admin operations
});

// All enrollment routes require authentication
router.use(authenticate);

// Admin route to get all enrollments
router.get('/', permit('ADMIN'), adminLimiter, getAllEnrollments);

// Get all user's enrollments
router.get('/me', permit('DIKE', 'UMUM', 'ADMIN'), getUserEnrollments);

// Check if user is enrolled in any course
router.get('/isenrolled', permit('DIKE', 'UMUM', 'ADMIN'), checkIsEnrolled);

// Get enrollment by ID
router.get('/:id', permit('DIKE', 'UMUM', 'ADMIN'), getEnrollmentById);

// Check if user is enrolled in a course
router.get('/:courseId/status', permit('DIKE', 'UMUM', 'ADMIN'), checkEnrollmentStatus);

// Update enrollment progress
router.patch('/:id/progress', permit('DIKE', 'UMUM', 'ADMIN'), updateProgress);

export default router;

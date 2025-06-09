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
import { 
  createRateLimiter,
  paymentStatusLimiter,
  defaultLimiter
} from '../middlewares/rateLimiter.js';

const router = express.Router();

// Create specific rate limiters for enrollment operations
const adminLimiter = createRateLimiter({
  name: 'Admin Enrollment Operations',
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2000, // High limit for admin operations
  skipSuccessfulRequests: true
});

const userEnrollmentLimiter = createRateLimiter({
  name: 'User Enrollment Operations',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Higher limit for enrollment viewing
  skipSuccessfulRequests: true // Don't count successful reads
});

const enrollmentStatusLimiter = createRateLimiter({
  name: 'Enrollment Status Check',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Very high limit for status checks (frequently used)
  skipSuccessfulRequests: true
});

const progressUpdateLimiter = createRateLimiter({
  name: 'Progress Update',
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Moderate limit for progress updates
  skipSuccessfulRequests: true
});

// All enrollment routes require authentication
router.use(authenticate);

// Admin route to get all enrollments
router.get('/', 
  permit('ADMIN'), 
  adminLimiter, 
  getAllEnrollments
);

// Get all user's enrollments
router.get('/me', 
  permit('DIKE', 'UMUM', 'ADMIN'), 
  userEnrollmentLimiter,
  getUserEnrollments
);

// Check if user is enrolled in any course
router.get('/isenrolled', 
  permit('DIKE', 'UMUM', 'ADMIN'), 
  enrollmentStatusLimiter,
  checkIsEnrolled
);

// Get enrollment by ID
router.get('/:id', 
  permit('DIKE', 'UMUM', 'ADMIN'), 
  userEnrollmentLimiter,
  getEnrollmentById
);

// Check if user is enrolled in a course - high frequency endpoint
router.get('/:courseId/status', 
  permit('DIKE', 'UMUM', 'ADMIN'), 
  enrollmentStatusLimiter, // Higher limit for status checks
  checkEnrollmentStatus
);

// Update enrollment progress - moderate frequency
router.patch('/:id/progress', 
  permit('DIKE', 'UMUM', 'ADMIN'), 
  progressUpdateLimiter,
  updateProgress
);

export default router;
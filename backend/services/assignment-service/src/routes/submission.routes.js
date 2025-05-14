import { Router } from 'express';
import { authenticate, permit, authorizeStudents } from '../utils/rbac/index.js';
import * as controller from '../controllers/assignment.controller.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { createRateLimiter } from '../middlewares/rateLimiter.js';
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';
import { Roles } from '../utils/rbac/roles.js';

const router = Router();

// Create rate limiters
const adminLimiter = createRateLimiter({
  name: 'Admin Operations',
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2000 // limit admin operations
});

const standardLimiter = createRateLimiter({
  name: 'Standard API',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit standard operations
});

// Health check endpoint for submissions
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'submission-routes', 
    timestamp: new Date().toISOString() 
  });
});

// Submit assignment (students only)
router.post(
  '/:assignmentId',
  authenticate,
  authorizeStudents,
  standardLimiter,
  asyncHandler(controller.submitAssignment)
);

// Get all submissions (admin only)
router.get(
  '/',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  cacheMiddleware('all-submissions', 5 * 60), // 5 min cache
  asyncHandler(controller.getAllSubmissions)
);

// Get all submissions for a specific course (admin only)
router.get(
  '/course/:courseId',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  cacheMiddleware('course-submissions', 5 * 60), // 5 min cache
  asyncHandler(controller.getSubmissionsByCourse)
);

// Update submission file URL (submission owner only)
router.patch(
  '/:submissionId',
  authenticate,
  standardLimiter,
  asyncHandler(controller.updateSubmissionFileUrl)
);

// Get student's submissions (self or admin)
router.get(
  '/user/:userId',
  authenticate,
  asyncHandler(controller.getStudentSubmissions)
);

// Get logged-in user's submissions
router.get(
  '/me',
  authenticate,
  standardLimiter,
  asyncHandler(controller.getMySubmissions)
);

export default router;

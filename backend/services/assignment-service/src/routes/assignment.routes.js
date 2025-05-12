import { Router } from 'express';
import { authenticate, permit, authorizeStudents } from '../utils/rbac/index.js';
import * as controller from '../controllers/assignment.controller.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';
import { Roles } from '../utils/rbac/roles.js';

const router = Router();

// Create rate limiters
const adminLimiter = createRateLimiter({
  name: 'Admin Operations',
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50 // limit admin operations
});

const standardLimiter = createRateLimiter({
  name: 'Standard API',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit standard operations
});

// Health check endpoint for monitoring
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'assignment-service', 
    timestamp: new Date().toISOString() 
  });
});

// Create assignment (admin only)
router.post(
  '/',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  invalidateCache('course-assignments'),
  asyncHandler(controller.createAssignment)
);

// Get all assignments (admin view)
router.get(
  '/admin',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  cacheMiddleware('all-assignments', 15 * 60), // 15 min cache
  asyncHandler(controller.getAllAssignments)
);

// Get assignments by course
router.get(
  '/course/:courseId',
  authenticate,
  standardLimiter,
  cacheMiddleware('course-assignments', 10 * 60), // 10 min cache
  asyncHandler(controller.getAssignmentsByCourse)
);

// Get single assignment by ID
router.get(
  '/:id',
  authenticate,
  standardLimiter,
  cacheMiddleware('assignment', 10 * 60), // 10 min cache
  asyncHandler(controller.getAssignmentById)
);

// Update assignment (admin only)
router.put(
  '/:id',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  invalidateCache('assignment'),
  asyncHandler(controller.updateAssignment)
);

// Delete assignment (admin only)
router.delete(
  '/:id',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  invalidateCache('assignment'),
  asyncHandler(controller.deleteAssignment)
);

// === Submission routes ===

// Submit assignment (students only)
router.post(
  '/:id/submit',
  authenticate,
  authorizeStudents,
  standardLimiter,
  asyncHandler(controller.submitAssignment)
);

// Get submissions for an assignment (admin only)
router.get(
  '/:id/submissions',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  asyncHandler(controller.getSubmissionsByAssignment)
);

// Get student's submissions (self or admin)
router.get(
  '/submissions/user/:userId',
  authenticate,
  asyncHandler(controller.getStudentSubmissions)
);

// Grade a submission (admin only)
router.post(
  '/submissions/:submissionId/grade',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  asyncHandler(controller.gradeSubmission)
);

// Verify service authentication for inter-service communication
router.get(
  '/service/verify',
  asyncHandler(controller.verifyServiceAccess)
);

export default router;
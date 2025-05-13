import { Router } from 'express';
import { authenticate, permit } from '../utils/rbac/index.js';
import * as controller from '../controllers/assignment.controller.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { createRateLimiter } from '../middlewares/rateLimiter.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cacheMiddleware.js';
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

// Health check endpoint for monitoring
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'assignment-routes', 
    timestamp: new Date().toISOString() 
  });
});

// Get all assignments (admin view)
router.get(
  '/',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  cacheMiddleware('all-assignments', 15 * 60), // 15 min cache
  asyncHandler(controller.getAllAssignments)
);

// Create assignment (admin only)
router.post(
  '/',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  invalidateCache('course-assignments'),
  asyncHandler(controller.createAssignment)
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
  permit(Roles.ADMIN),
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

// Verify service authentication for inter-service communication
router.get(
  '/service/verify',
  asyncHandler(controller.verifyServiceAccess)
);

export default router;
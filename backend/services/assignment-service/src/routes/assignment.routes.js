import { Router } from 'express';
import { authenticate, permit } from '../utils/rbac/index.js';
import * as controller from '../controllers/assignment.controller.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { createRateLimiter } from '../middlewares/rateLimiter.js';
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

router.get(
  '/',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  asyncHandler(controller.getAllAssignments)
);

router.post(
  '/',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  asyncHandler(controller.createAssignment)
);

router.get(
  '/course/:courseId',
  authenticate,
  standardLimiter,
  asyncHandler(controller.getAssignmentsByCourse)
);

router.get(
  '/:id',
  authenticate,
  permit(Roles.ADMIN),
  standardLimiter,
  asyncHandler(controller.getAssignmentById)
);

router.put(
  '/:id',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  asyncHandler(controller.updateAssignment)
);

router.delete(
  '/:id',
  authenticate,
  permit(Roles.ADMIN),
  adminLimiter,
  asyncHandler(controller.deleteAssignment)
);

router.get(
  '/service/verify',
  asyncHandler(controller.verifyServiceAccess)
);

export default router;
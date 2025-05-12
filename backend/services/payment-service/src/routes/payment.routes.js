import { Router } from 'express';
import { authenticate, permit } from '../utils/rbac/index.js';
import * as controller from '../controllers/payment.controller.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { createRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Health check endpoint for Railway monitoring
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'payment-service', timestamp: new Date().toISOString() });
});

// Cache monitoring endpoint for admins
router.get('/cache-stats', authenticate, permit('ADMIN'), asyncHandler(async (req, res) => {
  const { getCacheStats, resetCacheStats } = await import('../utils/cache-monitor.js');
  
  // Reset stats if requested
  if (req.query.reset === 'true') {
    resetCacheStats();
    return res.json({ 
      status: 'success', 
      message: 'Cache statistics reset', 
      data: getCacheStats() 
    });
  }

  // Return current stats
  res.json({
    status: 'success',
    message: 'Cache statistics',
    data: getCacheStats()
  });
}));

// New endpoint to invalidate enrollment cache
router.post('/invalidate-cache', authenticate, permit('ADMIN'), asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const { invalidateCache } = await import('../utils/cache-helper.js');
  
  try {
    if (courseId) {
      // Invalidate specific course enrollment cache
      invalidateCache('enrollment', courseId);
      console.log(`Manual cache invalidation for course ${courseId} by admin ${req.user.id}`);
      
      res.json({
        status: 'success',
        message: `Enrollment cache for course ${courseId} has been invalidated`
      });
    } else {
      // Invalidate all enrollment caches
      invalidateCache('all-enrollments', 'all-enrollments');
      console.log(`Manual cache invalidation for all enrollments by admin ${req.user.id}`);
      
      res.json({
        status: 'success',
        message: 'All enrollment caches have been invalidated'
      });
    }
  } catch (error) {
    console.error('Error invalidating cache:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to invalidate cache'
    });
  }
}));

// Create payment (DIKE & UMUM)
router.post(
  '/',
  authenticate,
  permit('DIKE', 'UMUM'),
  asyncHandler(controller.createPayment)
);

// Create admin rate limiter
const adminLimiter = createRateLimiter({
  name: 'Admin Operations',
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2000 // limit admin operations
});

router.get(
  '/',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.getAllPayments)
);

router.patch(
  '/:id/approve',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.approvePayment)
);

router.patch(
  '/:id/back/complete',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.completeBack)
);

router.get(
  '/my-payments',
  authenticate,
  permit('DIKE', 'UMUM', 'ADMIN'),
  asyncHandler(controller.getUserPayments)
);

router.patch(
  '/:id/update',
  authenticate,
  permit('DIKE', 'UMUM'),
  asyncHandler(controller.updatePayment)
);

router.get(
  '/all-stats',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.getAllCoursesEnrollmentStats)
);

router.get(
  '/:courseId/stats',
  authenticate,
  permit('ADMIN', 'DIKE', 'UMUM'),
  asyncHandler(controller.getCourseEnrollmentStats)
);

router.get(
  '/:id',
  authenticate,
  permit('ADMIN', 'DIKE', 'UMUM'),
  asyncHandler(controller.getPaymentById)
);

router.delete(
  '/:id',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.deletePayment)
)

export default router;
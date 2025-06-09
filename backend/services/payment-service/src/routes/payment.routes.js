import { Router } from 'express';
import { authenticate, permit } from '../utils/rbac/index.js';
import * as controller from '../controllers/payment.controller.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { 
  createRateLimiter,
  paymentApiLimiter,
  paymentProcessLimiter,
  paymentStatusLimiter,
  defaultLimiter
} from '../middlewares/rateLimiter.js';

const router = Router();

// Health check endpoint for Railway monitoring - no rate limiting
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'payment-service', timestamp: new Date().toISOString() });
});

// Create admin rate limiter
const adminLimiter = createRateLimiter({
  name: 'Admin Operations',
  windowMs: 60 * 60 * 1000, // 1 hour  
  max: 2000, // limit admin operations
  skipSuccessfulRequests: true
});

// Create user rate limiter for regular operations
const userLimiter = createRateLimiter({
  name: 'User Operations',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for regular users
  skipSuccessfulRequests: false
});

// Cache monitoring endpoint for admins
router.get('/cache-stats', 
  authenticate, 
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(async (req, res) => {
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
  })
);

// Cache invalidation endpoint for admins
router.post('/invalidate-cache', 
  authenticate, 
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(async (req, res) => {
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
  })
);

// Create payment (DIKE & UMUM) - use payment process limiter for creation
router.post(
  '/',
  authenticate,
  permit('DIKE', 'UMUM'),
  paymentProcessLimiter, // Stricter limit for payment creation
  asyncHandler(controller.createPayment)
);

// Admin routes with admin limiter
router.get(
  '/',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.getAllPayments)
);

router.get(
  '/pending',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.getNeedToApprovePayments)
);

router.patch(
  '/:id/approve',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.approvePayment)
);

router.get(
  '/all-stats',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.getAllCoursesEnrollmentStats)
);

router.delete(
  '/:id',
  authenticate,
  permit('ADMIN'),
  adminLimiter,
  asyncHandler(controller.deletePayment)
);

// User payment routes with user limiter
router.get(
  '/my-payments',
  authenticate,
  permit('DIKE', 'UMUM', 'ADMIN'),
  userLimiter, // Use user limiter for viewing own payments
  asyncHandler(controller.getUserPayments)
);

router.patch(
  '/:id/update',
  authenticate,
  permit('DIKE', 'UMUM'),
  paymentProcessLimiter, // Stricter limit for payment updates
  asyncHandler(controller.updatePayment)
);

// Stats routes - different limits based on access level
router.get(
  '/:courseId/stats',
  authenticate,
  permit('ADMIN', 'DIKE', 'UMUM'),
  paymentStatusLimiter, // Use status limiter for stats viewing
  asyncHandler(controller.getCourseEnrollmentStats)
);

router.get(
  '/:id',
  authenticate,
  permit('ADMIN', 'DIKE', 'UMUM'),
  userLimiter,
  asyncHandler(controller.getPaymentById)
);

export default router;
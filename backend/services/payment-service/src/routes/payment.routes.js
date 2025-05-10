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
  max: 50 // limit admin operations
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
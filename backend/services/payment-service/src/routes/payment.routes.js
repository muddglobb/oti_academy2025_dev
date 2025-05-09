import { Router } from 'express';
import { authenticate, permit } from '../utils/rbac/index.js';
import * as controller from '../controllers/payment.controller.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

const router = Router();

// Create payment (DIKE & UMUM)
router.post(
  '/',
  authenticate,
  permit('DIKE', 'UMUM'),
  asyncHandler(controller.createPayment)
);

router.get(
  '/',
  authenticate,
  permit('ADMIN'),
  asyncHandler(controller.getAllPayments)
);

router.patch(
  '/:id/approve',
  authenticate,
  permit('ADMIN'),
  asyncHandler(controller.approvePayment)
);

router.patch(
  '/:id/back/complete',
  authenticate,
  permit('ADMIN'),
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
  asyncHandler(controller.deletePayment)
)

export default router;
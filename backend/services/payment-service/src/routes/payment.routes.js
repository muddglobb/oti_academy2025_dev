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

// Admin operations
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

// User operations
router.get(
  '/:id',
  authenticate,
  permit('ADMIN', 'DIKE', 'UMUM'),
  asyncHandler(controller.getPaymentById)
);

router.post(
  '/:id/back',
  authenticate,
  permit('DIKE'),
  asyncHandler(controller.requestBack)
);

// Delete payment (admin or owner)
router.delete(
  '/:id',
  authenticate,
  permit('ADMIN'),
  asyncHandler(controller.deletePayment)
);

export default router;
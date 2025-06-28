import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import packageRoutes from './package.routes.js';
import paymentRoutes from './payment.routes.js';
import groupPaymentRoutes from './group-payment.routes.js'; // TAMBAHAN BARU
import courseRoutes from './course.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import assignmentRoutes from './assignment.routes.js';
import submissionRoutes from './submission.routes.js';
import materialRoutes from './material.routes.js';
import { checkHealth } from '../controllers/health.controller.js';
import { 
  authLimiter, 
  paymentLimiter, 
  browsingLimiter, 
  uploadLimiter,
  adminLimiter,
  publicApiLimiter
} from '../middlewares/rateLimiter.js';

const router = Router();

// Health check endpoint - no rate limiting
router.get('/health', checkHealth);

// Mount routes with appropriate rate limiters
router.use('/auth', authLimiter, authRoutes);
router.use('/users', publicApiLimiter, userRoutes);
router.use('/packages', browsingLimiter, packageRoutes);
router.use('/payments', paymentLimiter, paymentRoutes);
router.use('/group-payments', paymentLimiter, groupPaymentRoutes); 
router.use('/courses', browsingLimiter, courseRoutes);
router.use('/enrollments', publicApiLimiter, enrollmentRoutes);
router.use('/assignments', browsingLimiter, assignmentRoutes);
router.use('/submissions', uploadLimiter, submissionRoutes);
router.use('/materials', browsingLimiter, materialRoutes);

export default router;
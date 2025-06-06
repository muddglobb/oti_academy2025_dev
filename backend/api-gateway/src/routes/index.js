import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import packageRoutes from './package.routes.js';
import paymentRoutes from './payment.routes.js';
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
router.use('/auth', authLimiter, authRoutes);  // Strict auth rate limiting
router.use('/users', publicApiLimiter, userRoutes);  // Standard rate limiting
router.use('/packages', browsingLimiter, packageRoutes);  // Higher limit for browsing
router.use('/payments', paymentLimiter, paymentRoutes);  // Moderate payment rate limiting
router.use('/courses', browsingLimiter, courseRoutes);  // Higher limit for browsing
router.use('/enrollments', publicApiLimiter, enrollmentRoutes);  // Standard rate limiting
router.use('/assignments', browsingLimiter, assignmentRoutes);  // Higher limit for browsing
router.use('/submissions', uploadLimiter, submissionRoutes);  // Lower limit for uploads
router.use('/materials', browsingLimiter, materialRoutes);  // Higher limit for browsing

export default router;
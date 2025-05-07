import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import packageRoutes from './package.routes.js';
import paymentRoutes from './payment.routes.js';
import courseRoutes from './course.routes.js';
import { checkHealth } from '../controllers/health.controller.js';

const router = Router();

// Health check endpoint
router.get('/health', checkHealth);

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/packages', packageRoutes);
router.use('/payments', paymentRoutes);
router.use('/courses', courseRoutes);

export default router;
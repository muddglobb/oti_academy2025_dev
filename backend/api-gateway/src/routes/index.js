import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import { checkHealth } from '../controllers/health.controller.js';

const router = Router();

// Health check endpoint
router.get('/health', checkHealth);

// Mount routes
router.use('/auth', authRoutes);

router.use('/users', userRoutes);

export default router;
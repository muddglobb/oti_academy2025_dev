import { Router } from 'express';
import authRoutes from './auth.routes.js';
import { checkHealth } from '../controllers/health.controller.js';

const router = Router();

// Health check endpoint
router.get('/health', checkHealth);

// Mount routes
router.use('/auth', authRoutes);

export default router;
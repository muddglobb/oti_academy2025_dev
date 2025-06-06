/**
 * Monitoring Routes for Course Service
 * Provides rate limiting monitoring and system health endpoints
 */

import { Router } from 'express';
import * as monitoringController from '../controllers/monitoring.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/async.middleware.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply admin rate limiting to all monitoring routes
router.use(Array.isArray(adminLimiter) ? adminLimiter : [adminLimiter]);

/**
 * @desc    Get rate limiting statistics
 * @route   GET /api/monitoring/rate-limits
 * @access  Admin only
 */
router.get(
  '/rate-limits',
  authenticate,
  authorize(['ADMIN']),
  asyncHandler(monitoringController.getRateLimitingStats)
);

/**
 * @desc    Get rate limiting health status
 * @route   GET /api/monitoring/rate-limits/health
 * @access  Admin only
 */
router.get(
  '/rate-limits/health',
  authenticate,
  authorize(['ADMIN']),
  asyncHandler(monitoringController.getRateLimitingHealth)
);

/**
 * @desc    Reset rate limiting statistics
 * @route   POST /api/monitoring/rate-limits/reset
 * @access  Admin only
 */
router.post(
  '/rate-limits/reset',
  authenticate,
  authorize(['ADMIN']),
  asyncHandler(monitoringController.resetRateLimitingStats)
);

/**
 * @desc    Get comprehensive monitoring dashboard data
 * @route   GET /api/monitoring/dashboard
 * @access  Admin only
 */
router.get(
  '/dashboard',
  authenticate,
  authorize(['ADMIN']),
  asyncHandler(monitoringController.getMonitoringDashboard)
);

/**
 * @desc    Health check endpoint (public)
 * @route   GET /api/monitoring/health
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Course service is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

export default router;

import { Router } from 'express';
import {
  createSession,
  updateSession,
  deleteSession
} from '../controllers/session.controller.js';
import { authenticate, authorizeRoles } from '../config/auth.js';
import { Roles } from '../libs/roles.js';
import { invalidateCache } from '../middleware/cacheMiddleware.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Create admin rate limiter
const adminLimiter = createRateLimiter({
    name: 'Admin Operations',
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 2000 // limit admin operations
});

// Apply admin rate limiter to all session routes
router.use(Array.isArray(adminLimiter) ? adminLimiter : [adminLimiter]);

// Admin-only operations on sessions
router.use(authenticate);
router.use(authorizeRoles(Roles.ADMIN));

router.post('/', invalidateCache('course-sessions'), createSession);
router.put('/:id', invalidateCache('course-sessions'), updateSession);
router.delete('/:id', invalidateCache('course-sessions'), deleteSession);

export default router;
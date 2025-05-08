import { Router } from 'express';
import {
  createSession,
  updateSession,
  deleteSession
} from '../controllers/session.controller.js';
import { authenticate, authorizeRoles } from '../config/auth.js';
import { Roles } from '../libs/roles.js';
import { invalidateCache } from '../middleware/cacheMiddleware.js';

const router = Router();

// Admin-only operations on sessions
router.use(authenticate);
router.use(authorizeRoles(Roles.ADMIN));

router.post('/', invalidateCache('course-sessions'), createSession);
router.put('/:id', invalidateCache('course-sessions'), updateSession);
router.delete('/:id', invalidateCache('course-sessions'), deleteSession);

export default router;